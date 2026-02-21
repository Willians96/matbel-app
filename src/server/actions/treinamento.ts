"use server";

import { db } from "@/db";
import { treinamentos, treinamentoItens, armas, coletes, algemas, municoes, users } from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/auth";
import { currentUser } from "@clerk/nextjs/server";

async function getDbUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Não autenticado");
    const [dbUser] = await db.select().from(users).where(eq(users.id, clerkUser.id));
    if (!dbUser) throw new Error("Usuário não encontrado no banco");
    return dbUser;
}

// ─── Criar Treinamento ────────────────────────────────────────────────────────
export async function createTreinamento(data: {
    userId: string;
    armaIds: number[];
    coleteIds?: number[];
    algemaIds?: number[];
    municaoId?: number;
    municaoQty?: number;
}) {
    await checkAdmin();
    const adminUser = await getDbUser();

    // 1. Criar o cabeçalho
    const id = crypto.randomUUID();
    await db.insert(treinamentos).values({
        id,
        adminId: adminUser.id,
        userId: data.userId,
        municaoId: data.municaoId ?? null,
        municaoQty: data.municaoQty ?? 0,
        status: "pending_acceptance",
    });

    // 2. Inserir itens (armas)
    for (const armaId of data.armaIds) {
        await db.insert(treinamentoItens).values({ treinamentoId: id, armaId });
    }
    // Coletes
    for (const coleteId of data.coleteIds ?? []) {
        await db.insert(treinamentoItens).values({ treinamentoId: id, coleteId });
    }
    // Algemas
    for (const algemaId of data.algemaIds ?? []) {
        await db.insert(treinamentoItens).values({ treinamentoId: id, algemaId });
    }

    revalidatePath("/dashboard/admin/treinamento");
    return { success: true, treinamentoId: id };
}

// ─── Aceitar Treinamento (Instrutor) ─────────────────────────────────────────
export async function acceptTreinamento(treinamentoId: string) {
    const user = await getDbUser();

    const [trein] = await db.select().from(treinamentos).where(
        and(eq(treinamentos.id, treinamentoId), eq(treinamentos.userId, user.id))
    );
    if (!trein) return { success: false, message: "Treinamento não encontrado." };
    if (trein.status !== "pending_acceptance") return { success: false, message: "Treinamento já foi processado." };

    // Marcar armas como em_uso
    const itens = await db.select().from(treinamentoItens).where(eq(treinamentoItens.treinamentoId, treinamentoId));
    for (const item of itens) {
        if (item.armaId) await db.update(armas).set({ status: "em_uso", userId: user.id }).where(eq(armas.id, item.armaId));
        if (item.coleteId) await db.update(coletes).set({ status: "em_uso", userId: user.id }).where(eq(coletes.id, item.coleteId));
        if (item.algemaId) await db.update(algemas).set({ status: "em_uso", userId: user.id }).where(eq(algemas.id, item.algemaId));
    }

    // Subtrair munição do estoque (munição entregue é consumida — volta como estojos vazios)
    if (trein.municaoId && trein.municaoQty > 0) {
        await db.update(municoes)
            .set({ availableQty: sql`available_qty - ${trein.municaoQty}` })
            .where(eq(municoes.id, trein.municaoId));
    }

    const signature = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    await db.update(treinamentos).set({
        status: "confirmed",
        confirmedAt: new Date(),
        signature,
    }).where(eq(treinamentos.id, treinamentoId));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin/treinamento");
    return { success: true, signature };
}

// ─── Devolver Treinamento (Instrutor) ────────────────────────────────────────
export async function returnTreinamento(treinamentoId: string, capsulesQty: number) {
    const user = await getDbUser();

    const [trein] = await db.select().from(treinamentos).where(
        and(eq(treinamentos.id, treinamentoId), eq(treinamentos.userId, user.id))
    );
    if (!trein) return { success: false, message: "Treinamento não encontrado." };
    if (trein.status !== "confirmed") return { success: false, message: "Treinamento não está confirmado." };

    // Liberar armas/coletes/algemas
    const itens = await db.select().from(treinamentoItens).where(eq(treinamentoItens.treinamentoId, treinamentoId));
    for (const item of itens) {
        if (item.armaId) await db.update(armas).set({ status: "disponivel", userId: null }).where(eq(armas.id, item.armaId));
        if (item.coleteId) await db.update(coletes).set({ status: "disponivel", userId: null }).where(eq(coletes.id, item.coleteId));
        if (item.algemaId) await db.update(algemas).set({ status: "disponivel", userId: null }).where(eq(algemas.id, item.algemaId));
    }

    // Registrar estojos vazios (apenas quantitativo, não retorna ao estoque)
    await db.update(treinamentos).set({
        status: "returned",
        returnedAt: new Date(),
        capsulesQty,
    }).where(eq(treinamentos.id, treinamentoId));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin/treinamento");
    return { success: true };
}

// ─── Queries ─────────────────────────────────────────────────────────────────
export async function getTreinamentosAtivos() {
    await checkAdmin();
    return db.select().from(treinamentos)
        .where(eq(treinamentos.status, "confirmed"))
        .orderBy(treinamentos.createdAt);
}

export async function getAllTreinamentos() {
    await checkAdmin();
    return db.select().from(treinamentos).orderBy(treinamentos.createdAt);
}

export async function getTreinamentoComItens(id: string) {
    const [trein] = await db.select().from(treinamentos).where(eq(treinamentos.id, id));
    if (!trein) return null;

    const itens = await db.select().from(treinamentoItens).where(eq(treinamentoItens.treinamentoId, id));

    const armaIds = itens.filter(i => i.armaId).map(i => i.armaId!);
    const armasList = armaIds.length > 0
        ? await db.select().from(armas).where(inArray(armas.id, armaIds))
        : [];

    const municao = trein.municaoId
        ? (await db.select().from(municoes).where(eq(municoes.id, trein.municaoId)))[0] ?? null
        : null;

    const instrutor = (await db.select().from(users).where(eq(users.id, trein.userId)))[0] ?? null;

    return { trein, itens, armasList, municao, instrutor };
}

export async function getActiveTreinamentoByInstrutor(userId: string) {
    const result = await db.select().from(treinamentos).where(
        and(
            eq(treinamentos.userId, userId),
            sql`${treinamentos.status} IN ('pending_acceptance', 'confirmed')`
        )
    ).orderBy(treinamentos.createdAt).limit(1);
    return result[0] ?? null;
}

export async function getTreinamentoPendente(userId: string) {
    const result = await db.select().from(treinamentos).where(
        and(eq(treinamentos.userId, userId), eq(treinamentos.status, "pending_acceptance"))
    ).limit(1);
    return result[0] ?? null;
}

export async function getTreinamentoConfirmado(userId: string) {
    const result = await db.select().from(treinamentos).where(
        and(eq(treinamentos.userId, userId), eq(treinamentos.status, "confirmed"))
    ).limit(1);
    return result[0] ?? null;
}


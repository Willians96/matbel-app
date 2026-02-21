"use server";

import { db } from "@/db";
import { treinamentos, treinamentoItens, armas, coletes, algemas, municoes, users } from "@/db/schema";
import { eq, and, or, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/auth";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type TreinamentoItemInput = {
    type: "arma" | "colete" | "algema";
    id: number;
};

// ─── Criar Treinamento ───────────────────────────────────────────────────────
export async function createTreinamento(data: {
    userId: string; // Instrutor
    items: TreinamentoItemInput[];
    municaoId?: number;
    municaoQty?: number;
}) {
    await checkAdmin();
    const clerkUser = await currentUser();
    const adminId = clerkUser?.id;
    if (!adminId) return { success: false, message: "Admin não autenticado." };

    if (data.items.length === 0 && !data.municaoId) {
        return { success: false, message: "O treinamento deve conter pelo menos um item ou munição." };
    }

    const userRecord = await db.select().from(users).where(eq(users.id, data.userId)).limit(1);
    if (!userRecord.length) return { success: false, message: "Instrutor não encontrado." };

    try {
        const treinamentoId = await db.transaction(async (tx) => {
            // 1. Criar o cabeçalho do treinamento
            const [newTreinamento] = await tx.insert(treinamentos).values({
                adminId,
                userId: data.userId,
                municaoId: data.municaoId ?? null,
                municaoQty: data.municaoQty ?? 0,
                status: "pending_acceptance",
            }).returning();

            // 2. Vincular itens (Armas, Coletes, Algemas)
            for (const item of data.items) {
                await tx.insert(treinamentoItens).values({
                    treinamentoId: newTreinamento.id,
                    armaId: item.type === "arma" ? item.id : null,
                    coleteId: item.type === "colete" ? item.id : null,
                    algemaId: item.type === "algema" ? item.id : null,
                });

                // 3. Atualizar status dos itens para 'em_uso'
                if (item.type === "arma") {
                    await tx.update(armas).set({ status: "em_uso" }).where(eq(armas.id, item.id));
                } else if (item.type === "colete") {
                    await tx.update(coletes).set({ status: "em_uso" }).where(eq(coletes.id, item.id));
                } else if (item.type === "algema") {
                    const algemaList = await tx.select().from(algemas).where(eq(algemas.id, item.id)).limit(1);
                    if (algemaList[0]?.hasRegistry) {
                        await tx.update(algemas).set({ status: "em_uso" }).where(eq(algemas.id, item.id));
                    }
                    // if pool algema, we'd need quantity, but for training usually it's registered or we skip for now
                }
            }

            // 4. Se houver munição, subtrair do estoque
            if (data.municaoId && (data.municaoQty ?? 0) > 0) {
                const municList = await tx.select().from(municoes).where(eq(municoes.id, data.municaoId)).limit(1);
                if (municList[0]) {
                    const newQty = municList[0].availableQty - (data.municaoQty ?? 0);
                    if (newQty < 0) throw new Error(`Estoque de munição insuficiente no lote ${municList[0].batch}.`);
                    await tx.update(municoes).set({ availableQty: newQty }).where(eq(municoes.id, data.municaoId));
                }
            }

            return newTreinamento.id;
        });

        revalidatePath("/dashboard/admin/treinamento");
        revalidatePath("/dashboard/my-equipment");
        return { success: true, message: "Treinamento criado. Aguardando aceite do instrutor.", id: treinamentoId };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return { success: false, message: msg || "Erro ao criar treinamento." };
    }
}

// ─── Aceitar Treinamento (Instrutor) ──────────────────────────────────────────
export async function acceptTreinamento(treinamentoId: string) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/");

    const treinamento = await db
        .select()
        .from(treinamentos)
        .where(and(eq(treinamentos.id, treinamentoId), eq(treinamentos.userId, clerkUser.id)))
        .limit(1);

    if (!treinamento.length) return { success: false, message: "Treinamento não encontrado." };
    if (treinamento[0].status !== "pending_acceptance") {
        return { success: false, message: "Este treinamento não está pendente de aceite." };
    }

    const signature = `${clerkUser.id}-${treinamentoId}-${Date.now()}`;

    await db
        .update(treinamentos)
        .set({ status: "confirmed", confirmedAt: new Date(), signature })
        .where(eq(treinamentos.id, treinamentoId));

    revalidatePath("/dashboard/my-equipment");
    return { success: true, message: "Carga de treinamento aceita!", signature };
}

// ─── Devolver Carga de Treinamento (Admin confirma) ───────────────────────────
export async function returnTreinamento(treinamentoId: string, capsulesQty: number) {
    await checkAdmin();

    const treinamento = await db.select().from(treinamentos).where(eq(treinamentos.id, treinamentoId)).limit(1);
    if (!treinamento.length) return { success: false, message: "Treinamento não encontrado." };
    if (treinamento[0].status !== "confirmed") return { success: false, message: "Apenas treinamentos ativos podem ser devolvidos." };

    try {
        await db.transaction(async (tx) => {
            // 1. Marcar como devolvido e registrar cápsulas
            await tx.update(treinamentos).set({
                status: "returned",
                returnedAt: new Date(),
                capsulesQty,
            }).where(eq(treinamentos.id, treinamentoId));

            // 2. Buscar itens vinculados para liberar
            const itens = await tx.select().from(treinamentoItens).where(eq(treinamentoItens.treinamentoId, treinamentoId));

            for (const item of itens) {
                if (item.armaId) {
                    await tx.update(armas).set({ status: "disponivel" }).where(eq(armas.id, item.armaId));
                } else if (item.coleteId) {
                    await tx.update(coletes).set({ status: "disponivel" }).where(eq(coletes.id, item.coleteId));
                } else if (item.algemaId) {
                    await tx.update(algemas).set({ status: "disponivel" }).where(eq(algemas.id, item.algemaId));
                }
            }
        });

        revalidatePath("/dashboard/admin/treinamento");
        revalidatePath("/dashboard/my-equipment");
        return { success: true, message: "Treinamento devolvido com sucesso." };
    } catch (e: unknown) {
        return { success: false, message: "Erro ao devolver treinamento." };
    }
}

// ─── Queries de Auxílio ───────────────────────────────────────────────────────

export async function getTreinamentoAtivo(userId: string) {
    return db
        .select()
        .from(treinamentos)
        .where(and(eq(treinamentos.userId, userId), or(eq(treinamentos.status, "pending_acceptance"), eq(treinamentos.status, "confirmed"))))
        .limit(1)
        .then(r => r[0] ?? null);
}

export async function getTreinamentoWithDetails(id: string) {
    const header = await db.select().from(treinamentos).where(eq(treinamentos.id, id)).limit(1).then(r => r[0]);
    if (!header) return null;

    const itens = await db.select().from(treinamentoItens).where(eq(treinamentoItens.treinamentoId, id));
    const [instutor, admin, munic] = await Promise.all([
        db.select().from(users).where(eq(users.id, header.userId)).limit(1).then(r => r[0]),
        db.select().from(users).where(eq(users.id, header.adminId)).limit(1).then(r => r[0]),
        header.municaoId ? db.select().from(municoes).where(eq(municoes.id, header.municaoId)).limit(1).then(r => r[0]) : null,
    ]);

    const itemDetails = await Promise.all(itens.map(async (it) => {
        if (it.armaId) return { type: "arma", detail: await db.select().from(armas).where(eq(armas.id, it.armaId)).limit(1).then(r => r[0]) };
        if (it.coleteId) return { type: "colete", detail: await db.select().from(coletes).where(eq(coletes.id, it.coleteId)).limit(1).then(r => r[0]) };
        if (it.algemaId) return { type: "algema", detail: await db.select().from(algemas).where(eq(algemas.id, it.algemaId)).limit(1).then(r => r[0]) };
        return null;
    }));

    return {
        header,
        instutor,
        admin,
        munic,
        itens: itemDetails.filter(Boolean),
    };
}

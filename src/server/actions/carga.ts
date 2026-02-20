"use server";

import { db } from "@/db";
import { cargas, armas, coletes, algemas, municoes, users } from "@/db/schema";
import { eq, and, or, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/auth";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// ─── Criar Carga (admin cria, aguardando aceite do policial) ─────────────────

export async function createCarga(data: {
    userId: string;
    armaId?: number;
    coleteId?: number;
    algemaId?: number;
    algemaQty?: number;
    municaoId?: number;
    municaoQty?: number;
}) {
    await checkAdmin();
    const clerkUser = await currentUser();
    const adminId = clerkUser?.id;
    if (!adminId) return { success: false, message: "Admin não autenticado." };

    const hasItem = data.armaId || data.coleteId || data.algemaId || data.municaoId;
    if (!hasItem) {
        return { success: false, message: "A carga deve conter pelo menos um item." };
    }

    const userRecord = await db.select().from(users).where(eq(users.id, data.userId)).limit(1);
    if (!userRecord.length) return { success: false, message: "Policial não encontrado." };

    const existingPending = await db
        .select()
        .from(cargas)
        .where(and(eq(cargas.userId, data.userId), eq(cargas.status, "pending_acceptance")))
        .limit(1);
    if (existingPending.length > 0) {
        return { success: false, message: "Este policial já possui uma carga pendente de aceite." };
    }

    try {
        await db.transaction(async (tx) => {
            if (data.armaId) {
                await tx.update(armas).set({ status: "em_uso" }).where(eq(armas.id, data.armaId));
            }
            if (data.coleteId) {
                await tx.update(coletes).set({ status: "em_uso" }).where(eq(coletes.id, data.coleteId));
            }
            if (data.algemaId && (data.algemaQty ?? 0) > 0) {
                const algemaList = await tx.select().from(algemas).where(eq(algemas.id, data.algemaId)).limit(1);
                if (algemaList[0]) {
                    if (algemaList[0].hasRegistry) {
                        await tx.update(algemas).set({ status: "em_uso" }).where(eq(algemas.id, data.algemaId));
                    } else {
                        const newQty = algemaList[0].availableQty - (data.algemaQty ?? 1);
                        if (newQty < 0) throw new Error("Estoque de algemas insuficiente.");
                        await tx.update(algemas).set({ availableQty: newQty }).where(eq(algemas.id, data.algemaId));
                    }
                }
            }
            if (data.municaoId && (data.municaoQty ?? 0) > 0) {
                const municList = await tx.select().from(municoes).where(eq(municoes.id, data.municaoId)).limit(1);
                if (municList[0]) {
                    const newQty = municList[0].availableQty - (data.municaoQty ?? 0);
                    if (newQty < 0) throw new Error("Estoque de munição insuficiente.");
                    await tx.update(municoes).set({ availableQty: newQty }).where(eq(municoes.id, data.municaoId));
                }
            }
            await tx.insert(cargas).values({
                adminId,
                userId: data.userId,
                armaId: data.armaId ?? null,
                coleteId: data.coleteId ?? null,
                algemaId: data.algemaId ?? null,
                algemaQty: data.algemaQty ?? 0,
                municaoId: data.municaoId ?? null,
                municaoQty: data.municaoQty ?? 0,
                status: "pending_acceptance",
            });
        });

        revalidatePath("/dashboard/admin/carga");
        revalidatePath("/dashboard/my-equipment");
        return { success: true, message: "Carga criada com sucesso. Aguardando aceite do policial." };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return { success: false, message: msg || "Erro ao criar carga." };
    }
}

// ─── Aceitar Carga (policial aceita) ─────────────────────────────────────────

export async function aceitarCarga(cargaId: string) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/");

    const carga = await db
        .select()
        .from(cargas)
        .where(and(eq(cargas.id, cargaId), eq(cargas.userId, clerkUser.id)))
        .limit(1);

    if (!carga.length) return { success: false, message: "Carga não encontrada." };
    if (carga[0].status !== "pending_acceptance") {
        return { success: false, message: "Esta carga não está pendente de aceite." };
    }

    const signature = `${clerkUser.id}-${cargaId}-${Date.now()}`;

    await db
        .update(cargas)
        .set({ status: "confirmed", confirmedAt: new Date(), signature })
        .where(eq(cargas.id, cargaId));

    revalidatePath("/dashboard/my-equipment");
    return { success: true, message: "Carga aceita com sucesso!", signature };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getCargaAtiva(userId: string) {
    const result = await db
        .select()
        .from(cargas)
        .where(and(eq(cargas.userId, userId), or(
            eq(cargas.status, "pending_acceptance"),
            eq(cargas.status, "confirmed")
        )))
        .limit(1);
    return result[0] ?? null;
}

export async function getCargaWithDetails(cargaId: string) {
    const cargaList = await db.select().from(cargas).where(eq(cargas.id, cargaId)).limit(1);
    if (!cargaList.length) return null;
    const c = cargaList[0];

    const [arma, colete, algema, munic, policial] = await Promise.all([
        c.armaId ? db.select().from(armas).where(eq(armas.id, c.armaId)).limit(1).then(r => r[0]) : null,
        c.coleteId ? db.select().from(coletes).where(eq(coletes.id, c.coleteId)).limit(1).then(r => r[0]) : null,
        c.algemaId ? db.select().from(algemas).where(eq(algemas.id, c.algemaId)).limit(1).then(r => r[0]) : null,
        c.municaoId ? db.select().from(municoes).where(eq(municoes.id, c.municaoId)).limit(1).then(r => r[0]) : null,
        db.select().from(users).where(eq(users.id, c.userId)).limit(1).then(r => r[0]),
    ]);

    return { carga: c, arma, colete, algema, munic, policial };
}

export async function searchUserByRe(re: string) {
    if (!re || re.length < 3) return [];
    return db.select().from(users).where(like(users.re, `%${re}%`)).limit(5);
}

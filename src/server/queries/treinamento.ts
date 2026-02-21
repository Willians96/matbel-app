"use server";

import { db } from "@/db";
import { treinamentos, treinamentoItens, users, armas, coletes, algemas, municoes } from "@/db/schema";
import { eq, desc, and, or } from "drizzle-orm";

export async function getRecentTreinamentos() {
    const list = await db
        .select()
        .from(treinamentos)
        .orderBy(desc(treinamentos.createdAt))
        .limit(20);

    return Promise.all(list.map(async (t) => {
        const [instrutor, admin, munic] = await Promise.all([
            db.select().from(users).where(eq(users.id, t.userId)).limit(1).then(r => r[0]),
            db.select().from(users).where(eq(users.id, t.adminId)).limit(1).then(r => r[0]),
            t.municaoId ? db.select().from(municoes).where(eq(municoes.id, t.municaoId)).limit(1).then(r => r[0]) : null,
        ]);

        const itemCount = await db
            .select({ count: treinamentoItens.id })
            .from(treinamentoItens)
            .where(eq(treinamentoItens.treinamentoId, t.id))
            .then(r => r.length);

        return {
            ...t,
            instrutor,
            admin,
            munic,
            itemCount,
        };
    }));
}

export async function getTreinamentosByStatus(status: 'pending_acceptance' | 'confirmed' | 'returned') {
    return db
        .select()
        .from(treinamentos)
        .where(eq(treinamentos.status, status))
        .orderBy(desc(treinamentos.createdAt));
}

"use server";

import { db } from "@/db";
import { cargas, armas, coletes, algemas, municoes } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

/**
 * Fetches the active/pending carga for a given userId.
 * Returns carga + joined item details for display.
 */
export async function getCargaPendenteOuAtiva(userId: string) {
    const cargaList = await db
        .select()
        .from(cargas)
        .where(
            and(
                eq(cargas.userId, userId),
                or(
                    eq(cargas.status, "pending_acceptance"),
                    eq(cargas.status, "confirmed")
                )
            )
        )
        .orderBy(cargas.createdAt)
        .limit(1);

    if (!cargaList.length) return null;
    const c = cargaList[0];

    const [arma, colete, algema, munic] = await Promise.all([
        c.armaId ? db.select().from(armas).where(eq(armas.id, c.armaId)).limit(1).then(r => r[0] ?? null) : null,
        c.coleteId ? db.select().from(coletes).where(eq(coletes.id, c.coleteId)).limit(1).then(r => r[0] ?? null) : null,
        c.algemaId ? db.select().from(algemas).where(eq(algemas.id, c.algemaId)).limit(1).then(r => r[0] ?? null) : null,
        c.municaoId ? db.select().from(municoes).where(eq(municoes.id, c.municaoId)).limit(1).then(r => r[0] ?? null) : null,
    ]);

    return {
        id: c.id,
        status: c.status as "pending_acceptance" | "confirmed" | "returned",
        createdAt: c.createdAt,
        algemaQty: c.algemaQty,
        municaoQty: c.municaoQty,
        arma: arma ? { name: arma.name, patrimony: arma.patrimony, serialNumber: arma.serialNumber, caliber: arma.caliber } : null,
        colete: colete ? { name: colete.name, patrimony: colete.patrimony, serialNumber: colete.serialNumber, size: colete.size } : null,
        algema: algema ? { name: algema.name, patrimony: algema.patrimony, serialNumber: algema.serialNumber, hasRegistry: algema.hasRegistry } : null,
        munic: munic ? { batch: munic.batch, description: munic.description, type: munic.type } : null,
    };
}

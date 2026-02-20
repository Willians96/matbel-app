"use server";

import { db } from "@/db";
import { armas, coletes, algemas, municoes } from "@/db/schema";
import { eq, like, or } from "drizzle-orm";

// ─── Armas ────────────────────────────────────────────────────────────────────

export async function searchArmas(query: string) {
    if (!query || query.length < 2) return [];
    return db
        .select()
        .from(armas)
        .where(
            or(
                like(armas.patrimony, `%${query}%`),
                like(armas.serialNumber, `%${query}%`),
                like(armas.name, `%${query}%`)
            )
        )
        .limit(10);
}

export async function getArmasDisponiveis() {
    return db.select().from(armas).where(eq(armas.status, "disponivel"));
}

export async function getArmaById(id: number) {
    const result = await db.select().from(armas).where(eq(armas.id, id)).limit(1);
    return result[0] ?? null;
}

// ─── Coletes ─────────────────────────────────────────────────────────────────

export async function searchColetes(query: string) {
    if (!query || query.length < 2) return [];
    return db
        .select()
        .from(coletes)
        .where(
            or(
                like(coletes.patrimony, `%${query}%`),
                like(coletes.serialNumber, `%${query}%`),
                like(coletes.name, `%${query}%`)
            )
        )
        .limit(10);
}

export async function getColetesDisponiveis() {
    return db.select().from(coletes).where(eq(coletes.status, "disponivel"));
}

export async function getColeteById(id: number) {
    const result = await db.select().from(coletes).where(eq(coletes.id, id)).limit(1);
    return result[0] ?? null;
}

// ─── Algemas ─────────────────────────────────────────────────────────────────

export async function searchAlgemas(query: string) {
    if (!query || query.length < 2) return [];
    return db
        .select()
        .from(algemas)
        .where(
            or(
                like(algemas.patrimony, `%${query}%`),
                like(algemas.serialNumber, `%${query}%`),
                like(algemas.name, `%${query}%`),
                like(algemas.brand, `%${query}%`)
            )
        )
        .limit(10);
}

export async function getAlgemasDisponiveis() {
    // Returns all registered algemas + the generic pool (hasRegistry=false)
    return db.select().from(algemas).where(eq(algemas.status, "disponivel"));
}

export async function getAlgemaPool() {
    // The pool record for unregistered algemas (patrimony='0008', serialNumber='0009')
    const result = await db
        .select()
        .from(algemas)
        .where(eq(algemas.hasRegistry, false))
        .limit(1);
    return result[0] ?? null;
}

// ─── Munições ─────────────────────────────────────────────────────────────────

export async function getMunicoesBatches() {
    // Returns lotes com estoque disponível
    return db.select().from(municoes);
}

export async function getMunicaoById(id: number) {
    const result = await db.select().from(municoes).where(eq(municoes.id, id)).limit(1);
    return result[0] ?? null;
}

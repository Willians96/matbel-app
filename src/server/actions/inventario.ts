"use server";

import { db } from "@/db";
import { armas, coletes, algemas, municoes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/auth";
import { eq, and } from "drizzle-orm";

// ─── Armas ────────────────────────────────────────────────────────────────────

export async function createArma(data: {
    patrimony: string;
    serialNumber: string;
    name: string;
    caliber?: string;
    finish?: string;
    manufacturer?: string;
    observations?: string;
}) {
    await checkAdmin();
    try {
        await db.insert(armas).values({
            patrimony: data.patrimony.trim().toUpperCase(),
            serialNumber: data.serialNumber.trim().toUpperCase(),
            name: data.name.trim(),
            caliber: data.caliber?.trim() || null,
            finish: data.finish?.trim() || null,
            manufacturer: data.manufacturer?.trim() || null,
            observations: data.observations?.trim() || null,
            status: "disponivel",
        });
        revalidatePath("/dashboard/admin/inventario");
        return { success: true, message: "Arma cadastrada com sucesso." };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("UNIQUE")) return { success: false, message: "Patrimônio ou série já cadastrado." };
        return { success: false, message: "Erro ao cadastrar arma." };
    }
}

// ─── Coletes ─────────────────────────────────────────────────────────────────

export async function createColete(data: {
    patrimony: string;
    serialNumber: string;
    name: string;
    model?: string;
    size?: string;
    expiresAt?: string;
    observations?: string;
}) {
    await checkAdmin();
    try {
        await db.insert(coletes).values({
            patrimony: data.patrimony.trim().toUpperCase(),
            serialNumber: data.serialNumber.trim().toUpperCase(),
            name: data.name.trim(),
            model: data.model?.trim() || null,
            size: data.size?.trim() || null,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            observations: data.observations?.trim() || null,
            status: "disponivel",
        });
        revalidatePath("/dashboard/admin/inventario");
        return { success: true, message: "Colete cadastrado com sucesso." };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("UNIQUE")) return { success: false, message: "Patrimônio ou série já cadastrado." };
        return { success: false, message: "Erro ao cadastrar colete." };
    }
}

// ─── Algemas ─────────────────────────────────────────────────────────────────

export async function createAlgema(data: {
    patrimony?: string;
    serialNumber?: string;
    name: string;
    brand?: string;
    model?: string;
    observations?: string;
    qty?: number;
}) {
    await checkAdmin();
    const hasRegistry = !!(data.patrimony?.trim() || data.serialNumber?.trim());
    const patrimony = data.patrimony?.trim().toUpperCase() || "0008";
    const serialNumber = data.serialNumber?.trim().toUpperCase() || "0009";

    try {
        if (!hasRegistry) {
            // Pool record: upsert — add qty to existing pool if it exists
            const existing = await db
                .select()
                .from(algemas)
                .where(and(eq(algemas.patrimony, "0008"), eq(algemas.serialNumber, "0009")))
                .limit(1);

            if (existing.length > 0) {
                const pool = existing[0];
                await db
                    .update(algemas)
                    .set({
                        totalQty: pool.totalQty + (data.qty ?? 1),
                        availableQty: pool.availableQty + (data.qty ?? 1),
                    })
                    .where(eq(algemas.id, pool.id));
            } else {
                await db.insert(algemas).values({
                    patrimony,
                    serialNumber,
                    name: data.name.trim(),
                    brand: data.brand?.trim() || null,
                    model: data.model?.trim() || null,
                    hasRegistry: false,
                    totalQty: data.qty ?? 1,
                    availableQty: data.qty ?? 1,
                    status: "disponivel",
                });
            }
        } else {
            await db.insert(algemas).values({
                patrimony,
                serialNumber,
                name: data.name.trim(),
                brand: data.brand?.trim() || null,
                model: data.model?.trim() || null,
                hasRegistry: true,
                totalQty: 1,
                availableQty: 1,
                status: "disponivel",
            });
        }
        revalidatePath("/dashboard/admin/inventario");
        return { success: true, message: "Algema cadastrada com sucesso." };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("UNIQUE")) return { success: false, message: "Patrimônio ou série já cadastrado." };
        return { success: false, message: "Erro ao cadastrar algema." };
    }
}

// ─── Munições ─────────────────────────────────────────────────────────────────

export async function createMunicao(data: {
    batch: string;
    description: string;
    type: string;
    qty: number;
    expiresAt?: string;
    observations?: string;
}) {
    await checkAdmin();
    try {
        await db.insert(municoes).values({
            batch: data.batch.trim().toUpperCase(),
            description: data.description.trim(),
            type: data.type.trim(),
            totalQty: data.qty,
            availableQty: data.qty,
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
            observations: data.observations?.trim() || null,
        });
        revalidatePath("/dashboard/admin/inventario");
        return { success: true, message: "Lote de munição cadastrado com sucesso." };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("UNIQUE")) return { success: false, message: "Número de lote já cadastrado." };
        return { success: false, message: "Erro ao cadastrar munição." };
    }
}

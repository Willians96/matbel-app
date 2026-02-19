"use server";

import { db } from "@/db";
import { equipamentos } from "@/db/schema";
import { desc, eq, like, and } from "drizzle-orm";

export type EquipmentFilters = {
    serialNumber?: string;
    patrimony?: string;
    unit?: string;
    status?: string;
};

export async function getEquipments(filters?: EquipmentFilters) {
    try {
        const conditions = [];

        if (filters?.serialNumber) {
            conditions.push(like(equipamentos.serialNumber, `%${filters.serialNumber}%`));
        }
        if (filters?.patrimony) {
            conditions.push(like(equipamentos.patrimony, `%${filters.patrimony}%`));
        }
        if (filters?.unit) {
            conditions.push(eq(equipamentos.unit, filters.unit));
        }
        if (filters?.status) {
            conditions.push(eq(equipamentos.status, filters.status as "disponivel" | "em_uso" | "manutencao" | "baixado"));
        }

        const data = await db
            .select()
            .from(equipamentos)
            .where(and(...conditions))
            .orderBy(desc(equipamentos.createdAt));

        return { success: true, data };
    } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
        return { success: false, error: "Falha ao carregar dados." };
    }
}

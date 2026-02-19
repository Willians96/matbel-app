"use server";

import { db } from "@/db";
import { equipamentos } from "@/db/schema";
import { desc, eq, like, and, count } from "drizzle-orm";

export type EquipmentFilters = {
    serialNumber?: string;
    patrimony?: string;
    unit?: string;
    status?: string;
};

export async function getEquipments(filters?: EquipmentFilters, page = 1, pageSize = 10) {
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
        // total count with same filters
        let totalRes;
        if (conditions.length > 0) {
            totalRes = await db.select({ total: count() }).from(equipamentos).where(and(...conditions));
        } else {
            totalRes = await db.select({ total: count() }).from(equipamentos);
        }
        const total = totalRes[0]?.total ?? 0;

        // pagination
        const offset = Math.max(0, (page - 1) * pageSize);
        let data;
        if (conditions.length > 0) {
            data = await db
                .select()
                .from(equipamentos)
                .where(and(...conditions))
                .orderBy(desc(equipamentos.createdAt))
                .limit(pageSize)
                .offset(offset);
        } else {
            data = await db
                .select()
                .from(equipamentos)
                .orderBy(desc(equipamentos.createdAt))
                .limit(pageSize)
                .offset(offset);
        }

        return { success: true, data, total };
    } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
        return { success: false, error: "Falha ao carregar dados." };
    }
}

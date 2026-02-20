"use server";

import { db } from "@/db";
import { equipamentos, users } from "@/db/schema";
import { desc, eq, like, and } from "drizzle-orm";

export type EquipmentFilters = {
    serialNumber?: string;
    patrimony?: string;
    unit?: string;
    status?: string;
    userRe?: string;
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
        if (filters?.unit && filters.unit !== 'all') {
            conditions.push(eq(equipamentos.unit, filters.unit));
        }
        if (filters?.status && filters.status !== 'all') {
            conditions.push(eq(equipamentos.status, filters.status as "disponivel" | "em_uso" | "manutencao" | "baixado"));
        }
        if (filters?.userRe) {
            conditions.push(like(users.re, `%${filters.userRe}%`));
        }

        const data = await db
            .select({
                id: equipamentos.id,
                serialNumber: equipamentos.serialNumber,
                patrimony: equipamentos.patrimony,
                name: equipamentos.name,
                category: equipamentos.category,
                unit: equipamentos.unit,
                status: equipamentos.status,
                createdAt: equipamentos.createdAt,
                user: {
                    name: users.name,
                    re: users.re,
                    rank: users.rank,
                }
            })
            .from(equipamentos)
            .leftJoin(users, eq(equipamentos.userId, users.id))
            .where(and(...conditions))
            .orderBy(desc(equipamentos.createdAt));

        return { success: true, data };
    } catch (error) {
        console.error("Erro ao buscar equipamentos:", error);
        return { success: false, error: "Falha ao carregar dados." };
    }
}

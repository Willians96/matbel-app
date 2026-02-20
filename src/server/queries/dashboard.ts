
import { db } from "@/db";
import { equipamentos, transactions } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";

export async function getDashboardStats() {
    try {
        // 1. KPI Counts
        const total = await db.select({ count: count() }).from(equipamentos);
        const available = await db.select({ count: count() }).from(equipamentos).where(eq(equipamentos.status, 'disponivel'));
        const inUse = await db.select({ count: count() }).from(equipamentos).where(eq(equipamentos.status, 'em_uso'));
        const maintenance = await db.select({ count: count() }).from(equipamentos).where(eq(equipamentos.status, 'manutencao'));

        // 2. Recent Activity (Last 5 Transactions)
        const recentActivity = await db.select({
            id: transactions.id,
            userRe: transactions.userRe,
            userName: transactions.userName,
            userRank: transactions.userRank,
            equipmentId: transactions.equipmentId,
            checkoutDate: transactions.checkoutDate,
            status: transactions.status,
            equipmentName: equipamentos.name,
            serialNumber: equipamentos.serialNumber,
        })
            .from(transactions)
            .innerJoin(equipamentos, eq(transactions.equipmentId, equipamentos.id))
            .orderBy(desc(transactions.checkoutDate))
            .limit(5);

        // 3. Category Distribution (for Charts)
        const categoryStats = await db.select({
            name: equipamentos.category,
            value: count(),
        })
            .from(equipamentos)
            .groupBy(equipamentos.category);

        return {
            success: true,
            data: {
                total: total[0].count,
                available: available[0].count,
                inUse: inUse[0].count,
                maintenance: maintenance[0].count,
                recentActivity,
                categoryStats,
            }
        };

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return { success: false, message: "Failed to fetch dashboard stats" };
    }
}

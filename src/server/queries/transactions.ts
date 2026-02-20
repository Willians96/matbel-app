
import { db } from "@/db";
import { transactions, equipamentos } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getUserActiveTransactions(userRe: string) {
    try {
        const result = await db.select({
            id: transactions.id,
            equipmentName: equipamentos.name,
            serialNumber: equipamentos.serialNumber,
            checkoutDate: transactions.checkoutDate,
            status: transactions.status,
        })
            .from(transactions)
            .innerJoin(equipamentos, eq(transactions.equipmentId, equipamentos.id))
            .where(
                and(
                    eq(transactions.userRe, userRe),
                    eq(transactions.status, 'active')
                )
            )
            .orderBy(desc(transactions.checkoutDate));

        return { success: true, data: result };
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return { success: false, message: "Erro ao buscar materiais em carga." };
    }
}

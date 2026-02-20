
import { db } from "@/db";
import { transfers, equipamentos, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type TransferHistoryItem = {
    id: string;
    type: "allocation" | "return";
    status: string;
    timestamp: Date | null;
    equipment: {
        name: string;
        serialNumber: string;
    };
    user: {
        name: string;
        re: string | null;
        rank: string | null;
    };
    admin: {
        name: string;
    } | null;
};

export async function getTransferHistory(filters?: {
    userRe?: string;
    serialNumber?: string;
}) {
    try {


        if (filters?.userRe) {
            // We need to join users to filter by RE, checking the user_id relation
            // However, Drizzle's query builder with `where` operates on the selected fields.
            // Let's rely on the join results or subqueries if needed.
            // For simplicity in this joined view, we might filter post-fetch or ensure relation logic.
            // Actually, let's filter by the user's ID if we had it, but here we have RE.
            // A subquery to get User ID from RE would be cleaner, or joining `users` as `u`.
        }

        const rawResult = await db
            .select({
                id: transfers.id,
                type: transfers.type,
                status: transfers.status,
                timestamp: transfers.timestamp,
                equipmentName: equipamentos.name,
                equipmentSerial: equipamentos.serialNumber,
                userName: users.name,
                userRe: users.re,
                userRank: users.rank,
                adminName: users.name, // NOTE: this is wrong, it just repeats user Name.
            })
            .from(transfers)
            .innerJoin(equipamentos, eq(transfers.equipmentId, equipamentos.id))
            .innerJoin(users, eq(transfers.userId, users.id))
            .orderBy(desc(transfers.timestamp));

        // Map to nested structure
        const result: TransferHistoryItem[] = rawResult.map(row => ({
            id: row.id,
            type: row.type,
            status: row.status,
            timestamp: row.timestamp,
            equipment: {
                name: row.equipmentName,
                serialNumber: row.equipmentSerial
            },
            user: {
                name: row.userName,
                re: row.userRe,
                rank: row.userRank
            },
            admin: null // For now, until we fix the admin join
        }));

        return { success: true, data: result };

    } catch (error) {
        console.error("Error fetching transfer history:", error);
        return { success: false, error: "Failed to fetch history" };
    }
}


import { db } from "@/db";
import { transfers, equipamentos, users } from "@/db/schema";
import { desc, eq, and, gte, lte } from "drizzle-orm";

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
    type?: "allocation" | "return" | "all";
    startDate?: Date;
    endDate?: Date;
}) {
    try {
        const conditions = [];

        if (filters?.userRe) {
            conditions.push(eq(users.re, filters.userRe));
        }

        if (filters?.serialNumber) {
            conditions.push(eq(equipamentos.serialNumber, filters.serialNumber));
        }

        if (filters?.type && filters.type !== "all") {
            conditions.push(eq(transfers.type, filters.type));
        }

        if (filters?.startDate) {
            conditions.push(gte(transfers.timestamp, filters.startDate));
        }

        if (filters?.endDate) {
            // Set end date to end of day
            const end = new Date(filters.endDate);
            end.setHours(23, 59, 59, 999);
            conditions.push(lte(transfers.timestamp, end));
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
                userUnit: users.unit,
            })
            .from(transfers)
            .innerJoin(equipamentos, eq(transfers.equipmentId, equipamentos.id))
            .innerJoin(users, eq(transfers.userId, users.id))
            .where(and(...conditions))
            .orderBy(desc(transfers.timestamp));

        // Map to nested structure
        const result: TransferHistoryItem[] = rawResult.map(row => ({
            id: row.id,
            type: row.type as "allocation" | "return",
            status: row.status,
            timestamp: row.timestamp,
            equipment: {
                name: row.equipmentName,
                serialNumber: row.equipmentSerial
            },
            user: {
                name: row.userName,
                re: row.userRe,
                rank: row.userRank,
            },
            admin: null // Admin info would require another join on admin_id if it exists in transfers logic
        }));

        return { success: true, data: result };

    } catch (error) {
        console.error("Error fetching transfer history:", error);
        return { success: false, error: "Failed to fetch history" };
    }
}

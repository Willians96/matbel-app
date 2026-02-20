import { db } from "@/db";
import { transfers } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getPendingTransfers(userId: string, role: string) {
    if (role === 'admin') {
        // Admin sees:
        // 1. Returns from users (waiting to be confirmed by admin)
        // 2. Allocations aimed at users (waiting for user confirmation) - maybe read-only?

        // Actually, for "Inbound" tasks:
        // Admin needs to confirm RETURNS.
        return await db.query.transfers.findMany({
            where: and(
                eq(transfers.status, "pending"),
                eq(transfers.type, "return")
            ),
            with: {
                equipment: true,
                user: true, // The user returning
            },
            orderBy: [desc(transfers.createdAt)],
        });
    } else {
        // User sees:
        // 1. Allocations from Admin (waiting for user confirmation)
        return await db.query.transfers.findMany({
            where: and(
                eq(transfers.status, "pending"),
                eq(transfers.type, "allocation"),
                eq(transfers.userId, userId)
            ),
            with: {
                equipment: true,
                // admin: true (if mapped)
            },
            orderBy: [desc(transfers.createdAt)],
        });
    }
}

export async function getUserTransfersHistory(userId: string) {
    return await db.query.transfers.findMany({
        where: eq(transfers.userId, userId),
        with: {
            equipment: true,
        },
        orderBy: [desc(transfers.createdAt)],
        limit: 20,
    });
}


"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserByRE(re: string) {
    if (!re) return null;
    try {
        const user = await db.select().from(users).where(eq(users.re, re)).get();
        if (user) {
            return {
                id: user.id,
                name: user.warName || user.name,
                unit: user.unit,
                rank: user.rank
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user by RE:", error);
        return null;
    }
}

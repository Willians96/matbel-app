import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
}

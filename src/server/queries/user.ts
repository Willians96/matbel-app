
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUserProfile() {
    const user = await currentUser();
    if (!user) return null;

    try {
        const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
        return dbUser;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

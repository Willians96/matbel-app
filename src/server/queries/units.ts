
import { db } from "@/db";
import { units } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
// import { unstable_cache } from "next/cache";

export async function getAllUnits() {
    return await db.query.units.findMany({
        where: eq(units.active, true),
        orderBy: [desc(units.createdAt)],
    });
}

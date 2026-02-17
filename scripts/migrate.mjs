
import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("Migrating database at:", url);

const client = createClient({
    url,
    authToken,
});

const db = drizzle(client);

async function main() {
    try {
        await migrate(db, { migrationsFolder: "drizzle" });
        console.log("Migrations complete!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed!", err);
        process.exit(1);
    }
}

main();

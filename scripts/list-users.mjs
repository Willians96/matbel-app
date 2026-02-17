
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
    try {
        const result = await client.execute("SELECT * FROM users");
        console.log("Registered Users:", result.rows);
    } catch (e) {
        console.error("Error fetching users:", e);
    }
}

main();

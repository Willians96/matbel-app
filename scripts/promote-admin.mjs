
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const email = process.argv[2];

if (!email) {
    console.log("Usage: node scripts/promote-admin.mjs <email>");
    process.exit(1);
}

async function main() {
    try {
        console.log(`Promoting user with email '${email}' to admin...`);
        const result = await client.execute({
            sql: "UPDATE users SET role = 'admin' WHERE email = ?",
            args: [email],
        });

        if (result.rowsAffected > 0) {
            console.log("Success! User is now an admin.");
        } else {
            console.log("User not found. Please ensure they have logged in at least once.");
        }
    } catch (e) {
        console.error("Error promoting user:", e);
    }
}

main();

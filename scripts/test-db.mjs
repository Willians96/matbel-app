
import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("Testing connection to:", url);
console.log("Token length:", authToken ? authToken.length : "MISSING");

const client = createClient({
    url,
    authToken,
});

async function test() {
    try {
        const result = await client.execute("SELECT 1");
        console.log("Connection SUCCESS!", result);
    } catch (e) {
        console.error("Connection FAILED:", e);
    }
}

test();


import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("Missing Turso credentials in .env.local");
    process.exit(1);
}

const client = createClient({ url, authToken });

const UNIDADES_PM = [
    "CPI-7",
    "7 BPM-I",
    "12 BPM-I",
    "14 BAEP",
    "22 BPM-I",
    "40 BPM-I",
    "50 BPM-I",
    "53 BPM-I",
    "54 BPM-I",
    "55 BPM-I"
];

async function seed() {
    console.log("Seeding units...");
    try {
        for (const unit of UNIDADES_PM) {
            await client.execute({
                sql: "INSERT OR IGNORE INTO units (name, active) VALUES (?, ?)",
                args: [unit, true],
            });
            console.log(`Added/Verified: ${unit}`);
        }
        console.log("Seeding complete!");
    } catch (e) {
        console.error("Error seeding units:", e);
    } finally {
        client.close();
    }
}

seed();

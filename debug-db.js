
const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function main() {
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    try {
        console.log("Checking tables...");
        const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
        console.log("Tables:", tables.rows.map(r => r.name));

        console.log("\nChecking indexes for 'armas'...");
        const indexes = await client.execute("PRAGMA index_list('armas')");
        console.log("Indexes on armas:", indexes.rows);

        for (const idx of indexes.rows) {
            const detail = await client.execute(`PRAGMA index_info('${idx.name}')`);
            console.log(`Detail for ${idx.name}:`, detail.rows);
        }

    } catch (e) {
        console.error(e);
    } finally {
        client.close();
    }
}

main();

const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('DB URL:', process.env.TURSO_CONNECTION_URL ? 'found' : 'MISSING');

async function main() {
    const client = createClient({
        url: process.env.TURSO_CONNECTION_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });


    const sql = fs.readFileSync(
        path.resolve(__dirname, 'drizzle/0007_bizarre_harry_osborn.sql'),
        'utf8'
    );

    // Split on statement-breakpoint comments
    const statements = sql
        .split(/-->[ ]*statement-breakpoint/)
        .map(s => s.trim())
        .filter(Boolean);

    console.log(`Applying ${statements.length} SQL statements...`);

    for (const stmt of statements) {
        try {
            await client.execute(stmt);
            console.log('✅', stmt.slice(0, 60).replace(/\n/g, ' '), '...');
        } catch (e) {
            if (e.message && e.message.includes('already exists')) {
                console.log('⏭️  Already exists, skipping:', stmt.slice(0, 60).replace(/\n/g, ' '));
            } else {
                console.error('❌ Error:', e.message);
                console.error('   Statement:', stmt.slice(0, 200));
            }
        }
    }

    console.log('\nDone!');
    client.close();
}

main().catch(console.error);


import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const url = process.env.TURSO_CONNECTION_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!url || !authToken) {
    console.error('Missing credentials');
    process.exit(1);
}

const client = createClient({
    url,
    authToken,
});

const targetEmail = process.argv[2];

if (!targetEmail) {
    console.error('Please provide an email address');
    console.error('Usage: node scripts/promote-admin.mjs <email>');
    process.exit(1);
}

async function promote() {
    console.log(`Promoting user ${targetEmail} to admin...`);
    try {
        await client.execute({
            sql: "UPDATE users SET role = 'admin' WHERE email = ?",
            args: [targetEmail]
        });

        console.log('Update command sent.');

        // Verify
        const result = await client.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [targetEmail]
        });

        console.log('User status:', result.rows);
    } catch (error) {
        console.error('Error:', error);
    }
}

promote();

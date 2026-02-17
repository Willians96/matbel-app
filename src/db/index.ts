
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const url = process.env.TURSO_CONNECTION_URL?.trim();
const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!url) {
    throw new Error('TURSO_CONNECTION_URL is missing in environment variables.');
}

if (!url.startsWith('libsql://') && !url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('ws://') && !url.startsWith('wss://')) {
    throw new Error(`TURSO_CONNECTION_URL must start with libsql://, https://, http://, ws:// or wss://. Received: ${url}`);
}

const client = createClient({
    url,
    authToken,
});

export const db = drizzle(client, { schema });

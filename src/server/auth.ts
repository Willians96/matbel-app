
'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';


export async function checkAdmin() {
    const user = await currentUser();

    if (!user) {
        redirect('/');
    }

    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();

    if (!dbUser || dbUser.role !== 'admin') {
        redirect('/unauthorized');
    }

    return true;
}

export async function getUserRole() {
    const user = await currentUser();
    if (!user) return null;

    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();

    if (!dbUser) {
        // Lazy Sync: User authenticating for the first time
        // We import dynamically to avoid circular dependencies if they arise, 
        // though currently safe.
        const { syncUser } = await import('@/server/actions/user');
        await syncUser();

        // Fetch again after sync
        const newDbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
        return newDbUser?.role ?? 'user';
    }

    return dbUser.role;
}

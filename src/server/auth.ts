
'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';


export async function checkAdmin() {
    const user = await currentUser();

    // If Clerk not configured in this environment (local/dev without secrets),
    // avoid hard redirect loops and allow the page to render (returns false).
    // This helps debugging and prevents navigation redirect thrashing.
    const clerkConfigured = Boolean(process.env.CLERK_SECRET_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
    if (!user) {
        if (clerkConfigured) {
            redirect('/');
        } else {
            return false;
        }
    }

    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();

    if (!dbUser || dbUser.role !== 'admin') {
        if (clerkConfigured) {
            redirect('/unauthorized');
        } else {
            return false;
        }
    }

    return true;
}

export async function getUserRole() {
    const user = await currentUser();
    if (!user) return null;
    const dbUser = await db.select().from(users).where(eq(users.id, user.id)).get();
    return dbUser?.role ?? null;
}

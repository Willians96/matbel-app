'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function syncUser() {
    const user = await currentUser();

    if (!user) {
        return { success: false, message: 'Not authenticated' };
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.id, user.id)).get();

    if (existingUser) {
        return { success: true, message: 'User already exists' };
    }

    // Insert user
    const email = user.emailAddresses[0]?.emailAddress ?? 'no-email';
    const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username || 'Anonymous';

    await db.insert(users).values({
        id: user.id,
        name,
        email,
        role: 'user', // Default role
    });

    return { success: true, message: 'User created' };
}

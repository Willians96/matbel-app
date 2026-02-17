
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
        return false;
    }

    return true;
}

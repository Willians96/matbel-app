'use client';

import { syncUser } from '@/server/actions/user';
import { useEffect } from 'react';

export function UserSync() {
    useEffect(() => {
        syncUser()
            .then((res) => console.log('User Sync:', res.message))
            .catch((err) => console.error('User Sync Error:', err));
    }, []);

    return null; // Invisible component
}

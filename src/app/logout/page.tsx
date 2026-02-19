
"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const { signOut } = useClerk();
    const router = useRouter();

    useEffect(() => {
        async function doLogout() {
            await signOut();
            router.push("/");
        }
        doLogout();
    }, [signOut, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-blue mx-auto"></div>
                <p className="text-muted-foreground">Saindo do sistema...</p>
            </div>
        </div>
    );
}

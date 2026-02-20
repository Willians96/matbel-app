import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import PageTransition from "@/components/ui/page-transition";
import { getUserRole } from "@/server/auth";

import { db } from "@/db";
import { declarations } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getUserRole();

    // Fetch pending declarations count for Admin Badge
    let pendingCount = 0;
    if (role === 'admin') {
        const result = await db.select({ count: count() })
            .from(declarations)
            .where(eq(declarations.status, "pending"));
        pendingCount = result[0]?.count || 0;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
            <Sidebar userRole={role} pendingCount={pendingCount} />
            <div className="flex-1 md:ml-64 flex flex-col min-w-0">
                <DashboardHeader userRole={role} pendingCount={pendingCount} />
                <main id="main" className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                    <PageTransition>{children}</PageTransition>
                </main>
            </div>
        </div>
    );
}

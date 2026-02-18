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
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar userRole={role} pendingCount={pendingCount} />
            <div className="flex-1 md:ml-64 flex flex-col">
                <DashboardHeader />
                <main id="main" className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <PageTransition>{children}</PageTransition>
                    </div>
                </main>
            </div>
        </div>
    );
}

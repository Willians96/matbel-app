import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import PageTransition from "@/components/ui/page-transition";
import { checkAdmin } from "@/server/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await checkAdmin();

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-8 overflow-y-auto">
                    <PageTransition>{children}</PageTransition>
                </main>
            </div>
        </div>
    );
}

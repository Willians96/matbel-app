import { redirect } from "next/navigation";
import { getUserRole } from "@/server/auth";
import Link from "next/link"; // Ensure Link is imported if used.

export default async function DashboardPage() {
    const role = await getUserRole();

    if (role !== 'admin') {
        redirect('/dashboard/profile');
    }

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
            <p className="text-muted-foreground">Bem-vindo ao painel administrativo do Matbel.</p>

            {/* ... rest of admin dashboard ... */}
            <div className="flex gap-4">
                <Link
                    href="/dashboard/equipment/new"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    + Novo Equipamento
                </Link>
            </div>
        </div>
    );
}

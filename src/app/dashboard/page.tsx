
import { redirect } from "next/navigation";
import { getUserRole } from "@/server/auth";
import Link from "next/link";
import { getDashboardStats } from "@/server/queries/dashboard";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default async function DashboardPage() {
    const role = await getUserRole();

    if (role !== 'admin') {
        redirect('/dashboard/profile');
    }

    const statsResult = await getDashboardStats();
    const stats = statsResult.success && statsResult.data ? statsResult.data : {
        total: 0, available: 0, inUse: 0, maintenance: 0, recentActivity: [], categoryStats: []
    };

    // Format data for charts
    const statusData = [
        { name: 'Disponível', value: stats.available },
        { name: 'Em Uso', value: stats.inUse },
        { name: 'Manutenção', value: stats.maintenance },
    ].filter(item => item.value > 0);

    const categoryData = stats.categoryStats;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Admin</h2>
                    <p className="text-muted-foreground">Visão geral do arsenal da unidade.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/dashboard/checkout"
                        className="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                        Cautela Rápida
                    </Link>
                    <Link
                        href="/dashboard/equipment/new"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pm-blue text-white hover:bg-pm-blue/90 h-10 px-4 py-2"
                    >
                        + Novo Equipamento
                    </Link>
                </div>
            </div>

            <AnalyticsCards data={{
                total: stats.total,
                available: stats.available,
                inUse: stats.inUse,
                maintenance: stats.maintenance
            }} />

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <div className="col-span-7 lg:col-span-4">
                    <AnalyticsCharts statusData={statusData} categoryData={categoryData} />
                </div>
                <div className="col-span-7 lg:col-span-3">
                    <RecentActivity activities={stats.recentActivity} />
                </div>
            </div>
        </div>
    );
}

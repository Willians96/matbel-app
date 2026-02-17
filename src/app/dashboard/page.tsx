
export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Bem-vindo ao painel administrativo do Matbel.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats cards will go here */}
            </div>

            <div className="flex gap-4">
                <a
                    href="/dashboard/equipment/new"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    + Novo Equipamento
                </a>
            </div>
        </div>
    );
}

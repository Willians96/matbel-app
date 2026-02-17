
import { checkAdmin } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
                <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
                <p className="text-muted-foreground">Você não tem permissão para acessar o painel administrativo.</p>
                <a href="/" className="px-4 py-2 bg-primary text-secondary rounded hover:bg-primary/90">
                    Voltar para Home
                </a>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </main>
        </div>
    );
}

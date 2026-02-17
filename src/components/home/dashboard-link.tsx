
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUserRole } from "@/server/auth";

export async function DashboardLink() {
    const role = await getUserRole();

    if (role === 'admin') {
        return (
            <Link href="/dashboard" className="w-full block">
                <button className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    Acessar Dashboard (Admin)
                    <ArrowRight className="w-4 h-4" />
                </button>
            </Link>
        );
    }

    return (
        <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-center">
            <p className="font-medium">Acesso Limitado</p>
            <p className="text-sm">Seu usuário tem permissões básicas.</p>
        </div>
    );
}


import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getUserRole } from "@/server/auth";

export async function DashboardLink() {
    const role = await getUserRole();

    return (
        <Link href={role === 'admin' ? "/dashboard" : "/dashboard/profile"} className="w-full block">
            <button className={`w-full font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-pm-blue hover:bg-pm-blue/90 text-white'}`}>
                {role === 'admin' ? 'Acessar Dashboard (Admin)' : 'Acessar Minha Área'}
                <ArrowRight className="w-4 h-4" />
            </button>
        </Link>
    );
}

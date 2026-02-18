
import Link from "next/link";
import { Button } from "@/components/ui";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 gap-6">
            <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-red-100 rounded-full text-red-600">
                    <ShieldAlert className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Acesso Restrito</h1>
                <p className="text-slate-600 max-w-md">
                    Esta área é restrita a administradores do sistema MATBEL.
                    Seu usuário não possui permissão para acessar este recurso.
                </p>
            </div>

            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">Voltar ao Início</Button>
                </Link>
                <Link href="/dashboard/profile">
                    <Button className="bg-pm-blue text-white hover:bg-pm-blue/90">
                        Acessar Minha Área
                    </Button>
                </Link>
            </div>
        </div>
    );
}

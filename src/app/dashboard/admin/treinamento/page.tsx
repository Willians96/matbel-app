import { checkAdmin } from "@/server/auth";
import { getRecentTreinamentos } from "@/server/queries/treinamento";
import { TreinamentoList } from "@/components/dashboard/treinamento/treinamento-list";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import Link from "next/link";

export default async function TreinamentoPage() {
    await checkAdmin();
    const treinamentos = await getRecentTreinamentos();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pm-blue text-white rounded-full shadow-lg shadow-blue-900/20">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-pm-blue">
                            Módulo de Treinamento
                        </h2>
                        <p className="text-muted-foreground text-sm font-medium">
                            Gestão de material bélico para sessões de instrução e tiro.
                        </p>
                    </div>
                </div>

                <Link href="/dashboard/admin/treinamento/novo">
                    <Button className="bg-pm-blue hover:bg-blue-800 text-white font-bold gap-2 shadow-md">
                        <Plus className="w-5 h-5" />
                        Novo Treinamento
                    </Button>
                </Link>
            </div>

            <TreinamentoList initialData={treinamentos} />
        </div>
    );
}

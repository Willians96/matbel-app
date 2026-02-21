import { checkAdmin } from "@/server/auth";
import { getMunicoesBatches } from "@/server/queries/inventario";
import { WizardTreinamento } from "@/components/dashboard/treinamento/wizard-treinamento";
import { Target, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NovoTreinamentoPage() {
    await checkAdmin();
    const municoes = await getMunicoesBatches();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/treinamento">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-pm-blue/10 text-pm-blue rounded-lg">
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-800">
                            Novo Registro de Treinamento
                        </h2>
                        <p className="text-muted-foreground text-xs font-medium">
                            Siga os passos para alocar material para a instrução.
                        </p>
                    </div>
                </div>
            </div>

            <WizardTreinamento municoes={municoes} />
        </div>
    );
}

import { checkAdmin } from "@/server/auth";
import { WizardCarga } from "@/components/dashboard/carga/wizard-carga";
import { ClipboardList } from "lucide-react";
import { getMunicoesBatches } from "@/server/queries/inventario";

export default async function CargaPage() {
    await checkAdmin();
    const municoes = await getMunicoesBatches();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full shadow-lg shadow-blue-900/20">
                    <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-pm-blue">
                        Criar Carga
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        Distribuição de equipamentos ao policial em etapas.
                    </p>
                </div>
            </div>

            <WizardCarga municoes={municoes} />
        </div>
    );
}

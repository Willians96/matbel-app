import { getMunicoesBatches } from "@/server/queries/inventario";
import { getAllTreinamentos } from "@/server/actions/treinamento";
import { WizardTreinamento } from "@/components/dashboard/treinamento/wizard-treinamento";
import { TreinamentoList } from "@/components/dashboard/treinamento/treinamento-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Plus, List } from "lucide-react";

export default async function TreinamentoPage() {
    const [municoes, treinamentos] = await Promise.all([
        getMunicoesBatches(),
        getAllTreinamentos(),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Treinamento</h1>
                    <p className="text-sm text-slate-500">Criar e gerenciar cargas temporárias para instrução.</p>
                </div>
            </div>

            <Tabs defaultValue="lista" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="lista" className="flex items-center gap-2">
                        <List className="w-4 h-4" /> Treinamentos
                    </TabsTrigger>
                    <TabsTrigger value="novo" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novo Treinamento
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="lista">
                    <TreinamentoList treinamentos={treinamentos} />
                </TabsContent>
                <TabsContent value="novo">
                    <WizardTreinamento municoes={municoes} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

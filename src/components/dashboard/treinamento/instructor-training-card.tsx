"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptTreinamento, returnTreinamento } from "@/server/actions/treinamento";
import { toast } from "sonner";
import { GraduationCap, PackageCheck, PackageX, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Treinamento = {
    id: string;
    status: string;
    municaoQty: number;
    capsulesQty: number;
    createdAt: Date | null;
};

interface Props {
    treinamento: Treinamento | null;
}

export function InstructorTrainingCard({ treinamento }: Props) {
    const [capsulesQty, setCapsulesQty] = useState(0);
    const [isPending, start] = useTransition();
    const router = useRouter();

    if (!treinamento) return null;

    function handleAccept() {
        start(async () => {
            const res = await acceptTreinamento(treinamento!.id);
            if (res.success) {
                toast.success("Carga de Treinamento Aceita!", {
                    description: "Itens agora estão sob sua responsabilidade.",
                });
                router.refresh();
            } else {
                toast.error("Erro", { description: res.message });
            }
        });
    }

    function handleReturn() {
        if (capsulesQty < 0) return;
        start(async () => {
            const res = await returnTreinamento(treinamento!.id, capsulesQty);
            if (res.success) {
                toast.success("Carga Devolvida!", {
                    description: `${capsulesQty} estojos vazios registrados.`,
                });
                router.refresh();
            } else {
                toast.error("Erro", { description: res.message });
            }
        });
    }

    if (treinamento.status === "pending_acceptance") {
        return (
            <div className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-5 space-y-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-bold text-orange-800">Carga de Treinamento Disponível</p>
                        <p className="text-sm text-orange-600">O administrador preparou uma carga para instrução.</p>
                    </div>
                </div>
                <Button onClick={handleAccept} disabled={isPending}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PackageCheck className="w-4 h-4 mr-2" />}
                    Aceitar Carga para Treino
                </Button>
            </div>
        );
    }

    if (treinamento.status === "confirmed") {
        return (
            <div className="rounded-2xl border-2 border-orange-400 bg-orange-50 p-5 space-y-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-bold text-orange-800">Carga de Treinamento Ativa</p>
                        <p className="text-sm text-orange-600">Informe os estojos vazios ao devolver.</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-orange-800 font-medium">
                        Estojos Vazios (de {treinamento.municaoQty} entregues)
                    </Label>
                    <Input
                        type="number"
                        min={0}
                        max={treinamento.municaoQty}
                        value={capsulesQty}
                        onChange={(e) => setCapsulesQty(parseInt(e.target.value) || 0)}
                        className="w-32 font-mono text-lg font-bold border-orange-300"
                        placeholder="0"
                    />
                    <p className="text-xs text-slate-500">Se não houve munição, informe 0.</p>
                </div>
                <Button onClick={handleReturn} disabled={isPending}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PackageX className="w-4 h-4 mr-2" />}
                    Devolver Carga de Treino
                </Button>
            </div>
        );
    }

    return null;
}

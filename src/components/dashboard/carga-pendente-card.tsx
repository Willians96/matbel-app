"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { aceitarCarga } from "@/server/actions/carga";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Crosshair, Shield, Link2, Zap, ClipboardCheck,
    CheckCircle2, Loader2, BellRing, Clock
} from "lucide-react";

type CargaPendente = {
    id: string;
    status: "pending_acceptance" | "confirmed" | "returned";
    createdAt: Date | null;
    algemaQty: number;
    municaoQty: number;
    arma?: { name: string; patrimony: string; serialNumber: string; caliber: string | null } | null;
    colete?: { name: string; patrimony: string; serialNumber: string; size: string | null } | null;
    algema?: { name: string; patrimony: string; serialNumber: string; hasRegistry: boolean } | null;
    munic?: { batch: string; description: string; type: string } | null;
};

interface Props {
    carga: CargaPendente | null;
}

export function CargaPendenteCard({ carga }: Props) {
    const [isPending, start] = useTransition();
    const [done, setDone] = useState(false);
    const router = useRouter();

    if (!carga) return null;

    const isPendingStatus = carga.status === "pending_acceptance";
    const isConfirmed = carga.status === "confirmed";

    async function handleAceitar() {
        start(async () => {
            const result = await aceitarCarga(carga!.id);
            if (result.success) {
                toast.success("Carga Aceita!", { description: "Você assinou digitalmente o recebimento." });
                setDone(true);
                router.refresh();
            } else {
                toast.error("Erro", { description: result.message });
            }
        });
    }

    return (
        <Card className={`border-2 ${isPendingStatus ? "border-amber-400 bg-amber-50" : "border-green-400 bg-green-50"} shadow-md`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isPendingStatus ? (
                            <BellRing className="w-5 h-5 text-amber-600 animate-pulse" />
                        ) : (
                            <ClipboardCheck className="w-5 h-5 text-green-600" />
                        )}
                        <CardTitle className={isPendingStatus ? "text-amber-800" : "text-green-800"}>
                            {isPendingStatus ? "Carga Pendente de Aceite" : "Carga Ativa Confirmada"}
                        </CardTitle>
                    </div>
                    <Badge className={isPendingStatus
                        ? "bg-amber-200 text-amber-800 border-amber-300"
                        : "bg-green-200 text-green-800 border-green-300"}>
                        {isPendingStatus ? <><Clock className="w-3 h-3 mr-1" />Pendente</> : <><CheckCircle2 className="w-3 h-3 mr-1" />Confirmada</>}
                    </Badge>
                </div>
                <CardDescription className={isPendingStatus ? "text-amber-700" : "text-green-700"}>
                    {isPendingStatus
                        ? "Um administrador preparou esta carga para você. Confira os itens e assine digitalmente."
                        : `Aceita em ${carga.createdAt ? new Date(carga.createdAt).toLocaleDateString("pt-BR") : "—"}.`}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {carga.arma && (
                        <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200">
                            <Crosshair className="w-4 h-4 text-pm-blue mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Arma</p>
                                <p className="text-sm font-semibold">{carga.arma.name}</p>
                                <p className="text-xs text-slate-500 font-mono">Pat: {carga.arma.patrimony}</p>
                            </div>
                        </div>
                    )}
                    {carga.colete && (
                        <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200">
                            <Shield className="w-4 h-4 text-pm-blue mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Colete</p>
                                <p className="text-sm font-semibold">{carga.colete.name}</p>
                                <p className="text-xs text-slate-500 font-mono">Pat: {carga.colete.patrimony} {carga.colete.size ? `| Tam: ${carga.colete.size}` : ""}</p>
                            </div>
                        </div>
                    )}
                    {carga.algema && (
                        <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200">
                            <Link2 className="w-4 h-4 text-pm-blue mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Algema</p>
                                <p className="text-sm font-semibold">{carga.algema.name}</p>
                                {carga.algema.hasRegistry
                                    ? <p className="text-xs text-slate-500 font-mono">Pat: {carga.algema.patrimony}</p>
                                    : <p className="text-xs text-slate-500">Qtd: {carga.algemaQty}</p>}
                            </div>
                        </div>
                    )}
                    {carga.munic && carga.municaoQty > 0 && (
                        <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-slate-200">
                            <Zap className="w-4 h-4 text-pm-blue mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Munição</p>
                                <p className="text-sm font-semibold">{carga.munic.description}</p>
                                <p className="text-xs text-slate-500">Lote: {carga.munic.batch} | Qtd: {carga.municaoQty}</p>
                            </div>
                        </div>
                    )}
                </div>

                {isPendingStatus && !done && (
                    <Button
                        onClick={handleAceitar}
                        disabled={isPending}
                        className="w-full bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md mt-2"
                    >
                        {isPending
                            ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Assinando...</>
                            : <><CheckCircle2 className="mr-2 w-4 h-4" />Aceitar e Assinar Digitalmente</>}
                    </Button>
                )}

                {(isConfirmed || done) && (
                    <div className="flex items-center gap-2 p-2 bg-green-100 rounded-lg text-green-700 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Carga aceita — itens sob sua responsabilidade.</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

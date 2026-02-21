"use client";

import { Badge } from "@/components/ui/badge";
import { GraduationCap, Crosshair, Zap, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Treinamento = {
    id: string;
    status: "pending_acceptance" | "confirmed" | "returned";
    municaoQty: number;
    capsulesQty: number;
    createdAt: Date | null;
    confirmedAt: Date | null;
    returnedAt: Date | null;
};

const STATUS_MAP: Record<string, { label: string; icon: typeof Clock; color: string }> = {
    pending_acceptance: { label: "Aguardando Aceite", icon: Clock, color: "bg-amber-100 text-amber-800 border-amber-200" },
    confirmed: { label: "Em Treinamento", icon: GraduationCap, color: "bg-orange-100 text-orange-800 border-orange-200" },
    returned: { label: "Devolvida", icon: CheckCircle2, color: "bg-green-100 text-green-800 border-green-200" },
};

interface Props {
    treinamentos: Treinamento[];
}

export function TreinamentoList({ treinamentos }: Props) {
    if (treinamentos.length === 0) {
        return (
            <div className="text-center py-16 text-slate-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Nenhum treinamento registrado.</p>
                <p className="text-sm">Use a aba "Novo Treinamento" para criar o primeiro.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {treinamentos.map((t) => {
                const st = STATUS_MAP[t.status] ?? STATUS_MAP.pending_acceptance;
                const Icon = st.icon;
                return (
                    <div key={t.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                    <GraduationCap className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-slate-800 font-mono">{t.id.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-xs text-slate-500">
                                        Criado em {t.createdAt ? format(new Date(t.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "—"}
                                    </p>
                                </div>
                            </div>
                            <Badge className={`text-xs border ${st.color}`}>
                                <Icon className="w-3 h-3 mr-1" /> {st.label}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                            {t.municaoQty > 0 && (
                                <span className="flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    {t.municaoQty} projéteis entregues
                                </span>
                            )}
                            {t.status === "returned" && t.municaoQty > 0 && (
                                <span className="flex items-center gap-1">
                                    <RotateCcw className="w-3 h-3 text-slate-400" />
                                    {t.capsulesQty} estojos devolvidos
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

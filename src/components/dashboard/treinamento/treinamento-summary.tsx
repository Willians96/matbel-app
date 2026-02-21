"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    CheckCircle2,
    ChevronLeft,
    User,
    Crosshair,
    Zap,
    Shield,
    Link2,
    Check,
    AlertTriangle
} from "lucide-react";
import { TreinamentoState } from "./wizard-treinamento";

interface TreinamentoSummaryProps {
    state: TreinamentoState;
    onBack: () => void;
    onConfirm: () => void;
    submitting: boolean;
}

export function TreinamentoSummary({ state, onBack, onConfirm, submitting }: TreinamentoSummaryProps) {
    const hasItems = state.armas.length > 0 || state.municao || state.outros.length > 0;

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Revisar Treinamento</h3>
                <p className="text-slate-500">Confira todos os dados antes de gerar o recibo para aceite.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Instrutor */}
                <Card className="p-6 border-slate-100 shadow-sm bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User className="w-3 h-3" /> Instrutor Responsável
                    </h4>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                            <span className="text-lg font-bold text-pm-blue">{state.userName?.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-800">{state.userName}</span>
                            <span className="text-sm text-slate-500 font-medium">{state.userRank} — RE: {state.userRe}</span>
                        </div>
                    </div>
                </Card>

                {/* Munição */}
                <Card className="p-6 border-slate-100 shadow-sm bg-slate-50/50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap className="w-3 h-3" /> Munição de Treino
                    </h4>
                    {state.municao ? (
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{state.municao.description}</span>
                                <span className="text-xs text-slate-500 uppercase">Lote: {state.municao.batch}</span>
                            </div>
                            <Badge className="bg-pm-blue text-white hover:bg-pm-blue px-3 py-1 text-base">
                                {state.municaoQty} un.
                            </Badge>
                        </div>
                    ) : (
                        <span className="text-sm text-slate-400 italic">Nenhuma munição selecionada</span>
                    )}
                </Card>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Crosshair className="w-3 h-3" /> Armas e Equipamentos ({state.armas.length + state.outros.length})
                </h4>

                {!hasItems ? (
                    <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">Atenção: Nenhum equipamento foi selecionado para este treinamento.</span>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                        {state.armas.map(a => (
                            <div key={a.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div className="w-8 h-8 bg-pm-blue/10 rounded-full flex items-center justify-center">
                                    <Crosshair className="w-4 h-4 text-pm-blue" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-slate-800 truncate">{a.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono italic">PAT: {a.patrimony}</span>
                                </div>
                            </div>
                        ))}
                        {state.outros.map(o => (
                            <div key={o.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div className={`w-8 h-8 ${o.type === 'colete' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center`}>
                                    {o.type === 'colete' ? <Shield className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-slate-800 truncate">{o.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono italic">PAT: {o.patrimony}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-8 border-t border-slate-100">
                <Button variant="ghost" onClick={onBack} disabled={submitting} className="gap-2 text-slate-500 font-bold">
                    <ChevronLeft className="w-4 h-4" /> Editar Dados
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={submitting || !state.userId || !hasItems}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-green-900/20"
                >
                    {submitting ? "Finalizando..." : "Confirmar e Gerar Recebimento"}
                    <Check className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}

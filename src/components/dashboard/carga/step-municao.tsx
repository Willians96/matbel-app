"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CargaState } from "./wizard-carga";
import { Zap, ArrowRight, ArrowLeft, CheckCircle2, SkipForward, AlertTriangle } from "lucide-react";

type Municao = {
    id: number; batch: string; description: string; type: string;
    availableQty: number; totalQty: number; expiresAt: Date | null;
};

interface Props {
    state: CargaState;
    onUpdate: (p: Partial<CargaState>) => void;
    municoes: Municao[];
    onNext: () => void;
    onBack: () => void;
}

export function StepMunicao({ state, onUpdate, municoes, onNext, onBack }: Props) {
    const [qty, setQty] = useState(state.municQty ?? 0);

    function select(m: Municao) {
        onUpdate({ munic: { id: m.id, batch: m.batch, description: m.description, type: m.type, availableQty: m.availableQty } });
        setQty(state.municQty ?? 0);
    }

    function handleQtyChange(val: number) {
        const max = state.munic?.availableQty ?? 0;
        const clamped = Math.min(Math.max(0, val), max);
        setQty(clamped);
        onUpdate({ municQty: clamped });
    }

    function skip() {
        onUpdate({ munic: undefined, municQty: 0 });
        onNext();
    }

    const availableBatches = municoes.filter(m => m.availableQty > 0);

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pm-blue/10 text-pm-blue mb-2">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Pagar Munição?</h3>
                <p className="text-sm text-slate-500">Escolha o lote e defina a quantidade. O estoque será deduzido. Opcional.</p>
            </div>

            {availableBatches.length === 0 ? (
                <div className="text-center py-6 text-amber-600">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Sem lotes de munição disponíveis.</p>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm max-h-52 overflow-y-auto">
                    {availableBatches.map((m) => {
                        const pct = (m.availableQty / m.totalQty) * 100;
                        return (
                            <button key={m.id} type="button" onClick={() => select(m)}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0
                                    ${state.munic?.id === m.id ? "bg-pm-blue/5 border-l-4 border-l-pm-blue" : ""}`}>
                                <Zap className="w-5 h-5 text-pm-blue shrink-0" />
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{m.description}</p>
                                    <p className="text-xs text-slate-500 font-mono">Lote: {m.batch} | Tipo: {m.type}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${pct < 20 ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-green-500"}`}
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className={`text-xs font-bold ${pct < 20 ? "text-red-600" : pct < 50 ? "text-amber-600" : "text-green-600"}`}>
                                            {m.availableQty} disponíveis
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {state.munic && (
                <div className="space-y-2">
                    <Label>Quantidade a Entregar (máx: {state.munic.availableQty})</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min={0}
                            max={state.munic.availableQty}
                            value={qty}
                            onChange={(e) => handleQtyChange(parseInt(e.target.value) || 0)}
                            className="w-28 font-mono text-lg font-bold"
                        />
                        <span className="text-sm text-slate-500">projéteis</span>
                    </div>
                </div>
            )}

            {state.munic && qty > 0 && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-bold text-green-800">{state.munic.description}</p>
                        <p className="text-xs text-green-700">Lote: {state.munic.batch} | Quantidade: <strong>{qty}</strong></p>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1"><ArrowLeft className="mr-2 w-4 h-4" /> Voltar</Button>
                <Button variant="outline" onClick={skip} className="flex-1 border-slate-300 text-slate-600"><SkipForward className="mr-2 w-4 h-4" /> Pular</Button>
                <Button onClick={onNext} disabled={!!state.munic && qty === 0} className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90">
                    Prosseguir <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, ArrowLeft, CheckCircle2, SkipForward, AlertTriangle } from "lucide-react";

type Municao = { id: number; batch: string; description: string; type: string; availableQty: number; totalQty: number; expiresAt: Date | null };
type MunicSelected = { id: number; batch: string; description: string; type: string; availableQty: number } | null;

interface Props {
    municoes: Municao[];
    selected: MunicSelected;
    qty: number;
    onUpdate: (munic: MunicSelected, qty: number) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepMunicaoTreino({ municoes, selected, qty, onUpdate, onNext, onBack }: Props) {
    const [localQty, setLocalQty] = useState(qty);

    // Priorizar lotes do tipo "TREINA" ou "TREINO"
    const treinaBatches = municoes.filter(m => m.availableQty > 0 && m.type.toUpperCase().includes("TREIN"));
    const otherBatches = municoes.filter(m => m.availableQty > 0 && !m.type.toUpperCase().includes("TREIN"));
    const available = [...treinaBatches, ...otherBatches];

    function select(m: Municao) {
        setLocalQty(0);
        onUpdate({ id: m.id, batch: m.batch, description: m.description, type: m.type, availableQty: m.availableQty }, 0);
    }

    function handleQty(val: number) {
        const max = selected?.availableQty ?? 0;
        const clamped = Math.min(Math.max(0, val), max);
        setLocalQty(clamped);
        onUpdate(selected, clamped);
    }

    function skip() {
        onUpdate(null, 0);
        onNext();
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-2">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Munição de Treinamento</h3>
                <p className="text-sm text-slate-500">Lotes TREINA aparecem primeiro. Munição entregue não retorna ao estoque.</p>
            </div>

            {available.length === 0 ? (
                <div className="text-center py-6 text-amber-600">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">Sem munição disponível no estoque.</p>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm max-h-52 overflow-y-auto">
                    {available.map((m) => {
                        const isTreina = m.type.toUpperCase().includes("TREIN");
                        const pct = (m.availableQty / m.totalQty) * 100;
                        return (
                            <button key={m.id} type="button" onClick={() => select(m)}
                                className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0
                                    ${selected?.id === m.id ? "bg-orange-50 border-l-4 border-l-orange-500" : ""}`}>
                                <Zap className={`w-5 h-5 shrink-0 ${isTreina ? "text-orange-500" : "text-pm-blue"}`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{m.description}</p>
                                        {isTreina && <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">TREINA</span>}
                                    </div>
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

            {selected && (
                <div className="space-y-2">
                    <Label>Quantidade a Entregar (máx: {selected.availableQty})</Label>
                    <div className="flex items-center gap-3">
                        <Input type="number" min={0} max={selected.availableQty} value={localQty}
                            onChange={(e) => handleQty(parseInt(e.target.value) || 0)}
                            className="w-28 font-mono text-lg font-bold" />
                        <span className="text-sm text-slate-500">projéteis</span>
                    </div>
                </div>
            )}

            {selected && localQty > 0 && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                    <div>
                        <p className="font-bold text-orange-800">{selected.description}</p>
                        <p className="text-xs text-orange-700">Lote: {selected.batch} | <strong>{localQty} projéteis</strong> (viram estojos vazios ao devolver)</p>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1"><ArrowLeft className="mr-2 w-4 h-4" /> Voltar</Button>
                <Button variant="outline" onClick={skip} className="flex-1 border-slate-300 text-slate-600"><SkipForward className="mr-2 w-4 h-4" /> Pular</Button>
                <Button onClick={onNext} disabled={!!selected && localQty === 0}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                    Prosseguir <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

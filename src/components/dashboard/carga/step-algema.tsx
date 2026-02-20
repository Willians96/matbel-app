"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAlgemasDisponiveis } from "@/server/queries/inventario";
import type { CargaState } from "./wizard-carga";
import { Link2, ArrowRight, ArrowLeft, CheckCircle2, SkipForward } from "lucide-react";

interface Props {
    state: CargaState;
    onUpdate: (p: Partial<CargaState>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepAlgema({ state, onUpdate, onNext, onBack }: Props) {
    const [results, setResults] = useState<Array<{
        id: number; name: string; patrimony: string; serialNumber: string;
        hasRegistry: boolean; brand: string | null; model: string | null;
        availableQty: number; totalQty: number; status: string;
    }>>([]);
    const [loaded, setLoaded] = useState(false);
    const [qty, setQty] = useState(state.algemaQty ?? 1);
    const [isPending, start] = useTransition();

    function load() {
        if (!loaded) {
            start(async () => {
                const res = await getAlgemasDisponiveis();
                setResults(res as typeof results);
                setLoaded(true);
            });
        }
    }

    function select(a: typeof results[0]) {
        onUpdate({
            algema: { id: a.id, name: a.name, patrimony: a.patrimony, serialNumber: a.serialNumber, hasRegistry: a.hasRegistry, brand: a.brand, model: a.model },
            algemaQty: a.hasRegistry ? 1 : qty,
        });
    }

    function handleQtyChange(val: number) {
        setQty(val);
        if (state.algema && !state.algema.hasRegistry) {
            onUpdate({ algemaQty: val });
        }
    }

    function skip() {
        onUpdate({ algema: undefined, algemaQty: 0 });
        onNext();
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pm-blue/10 text-pm-blue mb-2">
                    <Link2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Pagar Algema?</h3>
                <p className="text-sm text-slate-500">Escolha um item disponível. Este item é opcional.</p>
            </div>

            {!loaded && (
                <Button variant="outline" onClick={load} disabled={isPending} className="w-full">
                    {isPending ? "Carregando..." : "Ver Algemas Disponíveis"}
                </Button>
            )}

            {results.length > 0 && (
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm max-h-52 overflow-y-auto">
                    {results.map((a) => (
                        <button key={a.id} type="button" onClick={() => select(a)}
                            className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0
                                ${state.algema?.id === a.id ? "bg-pm-blue/5 border-l-4 border-l-pm-blue" : ""}`}>
                            <Link2 className="w-5 h-5 text-pm-blue shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold">{a.name} {a.brand && `(${a.brand})`}</p>
                                {a.hasRegistry
                                    ? <p className="text-xs text-slate-500 font-mono">Pat: {a.patrimony} | Série: {a.serialNumber}</p>
                                    : <p className="text-xs text-orange-600">Pool sem registro — Disponível: {a.availableQty}</p>}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {state.algema && !state.algema.hasRegistry && (
                <div className="space-y-2">
                    <Label>Quantidade a Entregar</Label>
                    <Input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)}
                        className="w-24"
                    />
                </div>
            )}

            {state.algema && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-bold text-green-800">{state.algema.name}</p>
                        {state.algema.hasRegistry
                            ? <p className="text-xs text-green-700 font-mono">Pat: {state.algema.patrimony} | Série: {state.algema.serialNumber}</p>
                            : <p className="text-xs text-green-700">Quantidade: {state.algemaQty}</p>}
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1"><ArrowLeft className="mr-2 w-4 h-4" /> Voltar</Button>
                <Button variant="outline" onClick={skip} className="flex-1 border-slate-300 text-slate-600"><SkipForward className="mr-2 w-4 h-4" /> Pular</Button>
                <Button onClick={onNext} disabled={!state.algema} className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90">
                    Prosseguir <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchArmas } from "@/server/queries/inventario";
import type { CargaState } from "./wizard-carga";
import { Crosshair, ArrowRight, ArrowLeft, CheckCircle2, SkipForward } from "lucide-react";

interface Props {
    state: CargaState;
    onUpdate: (p: Partial<CargaState>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepArma({ state, onUpdate, onNext, onBack }: Props) {
    const [query, setQuery] = useState(state.arma?.patrimony ?? "");
    const [results, setResults] = useState<Array<{ id: number; name: string; patrimony: string; serialNumber: string; caliber: string | null; manufacturer: string | null; status: string }>>([]);
    const [isPending, start] = useTransition();

    function handleSearch(val: string) {
        setQuery(val);
        if (val.length >= 2) {
            start(async () => {
                const res = await searchArmas(val);
                setResults((res as typeof results).filter(r => r.status === "disponivel"));
            });
        } else {
            setResults([]);
        }
    }

    function select(a: typeof results[0]) {
        onUpdate({ arma: { id: a.id, name: a.name, patrimony: a.patrimony, serialNumber: a.serialNumber, caliber: a.caliber, manufacturer: a.manufacturer } });
        setResults([]);
        setQuery(`${a.patrimony} — ${a.name}`);
    }

    function skip() {
        onUpdate({ arma: undefined });
        onNext();
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pm-blue/10 text-pm-blue mb-2">
                    <Crosshair className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Pagar Arma?</h3>
                <p className="text-sm text-slate-500">Busque por patrimônio, série ou nome. Este item é opcional.</p>
            </div>

            <div className="space-y-2">
                <Label>Buscar Arma (Patrimônio ou Série)</Label>
                <Input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Digite patrimônio ou número de série..."
                    className="font-mono"
                />
                {isPending && <p className="text-xs text-slate-400 text-center">Buscando...</p>}
                {results.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        {results.map((a) => (
                            <button key={a.id} type="button" onClick={() => select(a)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0">
                                <Crosshair className="w-5 h-5 text-pm-blue shrink-0" />
                                <div>
                                    <p className="font-semibold">{a.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">Pat: {a.patrimony} | Série: {a.serialNumber}</p>
                                    {a.caliber && <p className="text-xs text-slate-400">{a.caliber} • {a.manufacturer}</p>}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                {results.length === 0 && query.length >= 2 && !isPending && (
                    <p className="text-xs text-amber-600 text-center">Nenhuma arma disponível encontrada.</p>
                )}
            </div>

            {state.arma && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-bold text-green-800">{state.arma.name}</p>
                        <p className="text-xs text-green-700 font-mono">Pat: {state.arma.patrimony} | Série: {state.arma.serialNumber}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
                </Button>
                <Button variant="outline" onClick={skip} className="flex-1 border-slate-300 text-slate-600">
                    <SkipForward className="mr-2 w-4 h-4" /> Pular
                </Button>
                <Button onClick={onNext} disabled={!state.arma} className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90">
                    Prosseguir <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

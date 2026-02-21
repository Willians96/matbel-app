"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Plus, Trash2, Crosshair, ChevronRight, ChevronLeft } from "lucide-react";
import { searchArmas } from "@/server/queries/inventario";
import { TreinamentoState } from "./wizard-treinamento";

interface StepMultiArmaProps {
    state: TreinamentoState;
    onUpdate: (patch: Partial<TreinamentoState>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepMultiArma({ state, onUpdate, onNext, onBack }: StepMultiArmaProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    async function handleSearch() {
        if (!query || query.length < 2) return;
        setSearching(true);
        const res = await searchArmas(query);
        // Filter out already added or unavailable
        setResults(res.filter(r => r.status === "disponivel" && !state.armas.some(a => a.id === r.id)));
        setSearching(false);
    }

    function addArma(arma: any) {
        onUpdate({
            armas: [...state.armas, {
                id: arma.id,
                name: arma.name,
                patrimony: arma.patrimony,
                serialNumber: arma.serialNumber
            }]
        });
        setResults(results.filter(r => r.id !== arma.id));
    }

    function removeArma(id: number) {
        onUpdate({
            armas: state.armas.filter(a => a.id !== id)
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-pm-blue" />
                    Seleção de Armas
                </h3>
                <p className="text-sm text-slate-500">Busque e adicione todas as armas que o instrutor utilizará.</p>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Patrimônio ou Série..."
                        className="pl-9 h-12"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={searching} className="h-12 px-6 bg-slate-800 hover:bg-black text-white">
                    {searching ? "..." : "Buscar"}
                </Button>
            </div>

            {results.length > 0 && (
                <div className="grid gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 max-h-48 overflow-y-auto">
                    {results.map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">{r.name}</span>
                                <span className="text-xs text-slate-500 font-mono">PAT: {r.patrimony} | SÉRIE: {r.serialNumber}</span>
                            </div>
                            <Button size="sm" onClick={() => addArma(r)} className="gap-1 bg-green-600 hover:bg-green-700 text-white h-8">
                                <Plus className="w-3 h-3" /> Adicionar
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Armas Selecionadas ({state.armas.length})</h4>
                {state.armas.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 text-sm">
                        Nenhuma arma adicionada ainda.
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {state.armas.map((a) => (
                            <div key={a.id} className="flex items-center justify-between p-4 bg-pm-blue/5 rounded-2xl border border-pm-blue/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-pm-blue/10 rounded-full flex items-center justify-center">
                                        <Crosshair className="w-5 h-5 text-pm-blue" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800">{a.name}</span>
                                        <span className="text-xs text-slate-500 font-mono italic">PAT: {a.patrimony} | SÉRIE: {a.serialNumber}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeArma(a.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-6 mt-auto border-t border-slate-100">
                <Button variant="ghost" onClick={onBack} className="gap-2 text-slate-500 font-bold">
                    <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                    onClick={onNext}
                    disabled={state.armas.length === 0}
                    className="gap-2 bg-pm-blue hover:bg-blue-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-900/10"
                >
                    Próximo <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

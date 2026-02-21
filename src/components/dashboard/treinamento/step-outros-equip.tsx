"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, Trash2, Shield, Link2, ChevronRight, ChevronLeft } from "lucide-react";
import { searchColetes, searchAlgemas } from "@/server/queries/inventario";
import { TreinamentoState } from "./wizard-treinamento";

interface StepOutrosEquipProps {
    state: TreinamentoState;
    onUpdate: (patch: Partial<TreinamentoState>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepOutrosEquip({ state, onUpdate, onNext, onBack }: StepOutrosEquipProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    async function handleSearch() {
        if (!query || query.length < 2) return;
        setSearching(true);
        // Search in both categories
        const [resColetes, resAlgemas] = await Promise.all([
            searchColetes(query),
            searchAlgemas(query)
        ]);

        const combined = [
            ...resColetes.map(c => ({ ...c, type: "colete" })),
            ...resAlgemas.map(a => ({ ...a, type: "algema" }))
        ].filter(r => r.status === "disponivel" && !state.outros.some(o => o.id === r.id));

        setResults(combined);
        setSearching(false);
    }

    function addEquip(item: any) {
        onUpdate({
            outros: [...state.outros, {
                id: item.id,
                name: item.name,
                type: item.type as "colete" | "algema",
                patrimony: item.patrimony,
                serialNumber: item.serialNumber
            }]
        });
        setResults(results.filter(r => r.id !== item.id));
    }

    function removeEquip(id: number) {
        onUpdate({
            outros: state.outros.filter(o => o.id !== id)
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-pm-blue" />
                    Outros Equipamentos
                </h3>
                <p className="text-sm text-slate-500">Adicione coletes, algemas ou outros materiais necessários.</p>
            </div>

            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por Patrimônio ou Série..."
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
                            <div className="flex items-center gap-3">
                                {r.type === "colete" ? <Shield className="w-4 h-4 text-amber-600" /> : <Link2 className="w-4 h-4 text-blue-600" />}
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{r.name}</span>
                                    <span className="text-xs text-slate-500 font-mono">PAT: {r.patrimony} | SÉRIE: {r.serialNumber}</span>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => addEquip(r)} className="gap-1 bg-green-600 hover:bg-green-700 text-white h-8">
                                <Plus className="w-3 h-3" /> Adicionar
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Itens Selecionados ({state.outros.length})</h4>
                {state.outros.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 text-sm">
                        Nenhum equipamento adicional adicionado.
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {state.outros.map((o) => (
                            <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center">
                                        {o.type === "colete" ? <Shield className="w-5 h-5 text-amber-600" /> : <Link2 className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800">{o.name}</span>
                                        <span className="text-xs text-slate-500 font-mono italic">PAT: {o.patrimony} | SÉRIE: {o.serialNumber}</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeEquip(o.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
                    className="gap-2 bg-pm-blue hover:bg-blue-800 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-900/10"
                >
                    Próximo <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

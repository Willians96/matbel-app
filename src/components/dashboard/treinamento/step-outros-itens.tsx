"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { searchColetes } from "@/server/queries/inventario";
import { searchAlgemas } from "@/server/queries/inventario";
import { Shield, Link2, ArrowRight, ArrowLeft, X, Plus } from "lucide-react";

type Colete = { id: number; name: string; patrimony: string; serialNumber: string; model: string | null; size: string | null };
type Algema = { id: number; name: string; patrimony: string; serialNumber: string; brand: string | null; hasRegistry: boolean };

interface Props {
    coletes: Colete[];
    algemas: Algema[];
    onUpdate: (coletes: Colete[], algemas: Algema[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepOutrosItens({ coletes, algemas, onUpdate, onNext, onBack }: Props) {
    const [query, setQuery] = useState("");
    const [coleteResults, setColeteResults] = useState<Array<Colete & { status: string }>>([]);
    const [algemaResults, setAlgemaResults] = useState<Array<Algema & { status: string }>>([]);
    const [isPending, start] = useTransition();

    function handleSearch(val: string) {
        setQuery(val);
        if (val.length >= 2) {
            start(async () => {
                const colIds = new Set(coletes.map(c => c.id));
                const algIds = new Set(algemas.map(a => a.id));
                const [cRes, aRes] = await Promise.all([searchColetes(val), searchAlgemas(val)]);
                setColeteResults((cRes as Array<Colete & { status: string }>).filter(c => c.status === "disponivel" && !colIds.has(c.id)));
                setAlgemaResults((aRes as Array<Algema & { status: string }>).filter(a => a.status === "disponivel" && !algIds.has(a.id)));
            });
        } else {
            setColeteResults([]);
            setAlgemaResults([]);
        }
    }

    function addColete(c: Colete & { status: string }) {
        onUpdate([...coletes, { id: c.id, name: c.name, patrimony: c.patrimony, serialNumber: c.serialNumber, model: c.model, size: c.size }], algemas);
        setColeteResults([]); setAlgemaResults([]); setQuery("");
    }
    function addAlgema(a: Algema & { status: string }) {
        onUpdate(coletes, [...algemas, { id: a.id, name: a.name, patrimony: a.patrimony, serialNumber: a.serialNumber, brand: a.brand, hasRegistry: a.hasRegistry }]);
        setColeteResults([]); setAlgemaResults([]); setQuery("");
    }

    const totalItems = coletes.length + algemas.length;

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-2">
                    <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Outros Equipamentos</h3>
                <p className="text-sm text-slate-500">Adicione coletes ou algemas opcionalmente. Clique em "Concluir" quando terminar.</p>
            </div>

            {/* Itens já adicionados */}
            {totalItems > 0 && (
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Itens Adicionados ({totalItems})</Label>
                    {coletes.map(c => (
                        <div key={`c-${c.id}`} className="flex items-center justify-between gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-orange-600 shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-orange-800">{c.name}</p>
                                    <p className="text-xs text-orange-700 font-mono">Pat: {c.patrimony}</p>
                                </div>
                            </div>
                            <button onClick={() => onUpdate(coletes.filter(x => x.id !== c.id), algemas)} className="p-1 text-orange-400 hover:text-red-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {algemas.map(a => (
                        <div key={`a-${a.id}`} className="flex items-center justify-between gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Link2 className="w-4 h-4 text-orange-600 shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-orange-800">{a.name}</p>
                                    <p className="text-xs text-orange-700 font-mono">Pat: {a.patrimony}</p>
                                </div>
                            </div>
                            <button onClick={() => onUpdate(coletes, algemas.filter(x => x.id !== a.id))} className="p-1 text-orange-400 hover:text-red-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Busca por patrimônio/série */}
            <div className="space-y-2">
                <Label>Buscar por Patrimônio ou Série</Label>
                <Input value={query} onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Digite patrimônio ou número de série..." className="font-mono" />
                {isPending && <p className="text-xs text-slate-400 text-center">Buscando...</p>}

                {(coleteResults.length > 0 || algemaResults.length > 0) && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        {coleteResults.map(c => (
                            <button key={c.id} type="button" onClick={() => addColete(c)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0">
                                <Plus className="w-4 h-4 text-green-600 shrink-0" />
                                <Shield className="w-4 h-4 text-pm-blue shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">{c.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">Pat: {c.patrimony}</p>
                                </div>
                                <Badge className="ml-auto bg-blue-100 text-blue-800 border-blue-200 text-xs">Colete</Badge>
                            </button>
                        ))}
                        {algemaResults.map(a => (
                            <button key={a.id} type="button" onClick={() => addAlgema(a)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0">
                                <Plus className="w-4 h-4 text-green-600 shrink-0" />
                                <Link2 className="w-4 h-4 text-pm-blue shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">{a.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">Pat: {a.patrimony}</p>
                                </div>
                                <Badge className="ml-auto bg-orange-100 text-orange-800 border-orange-200 text-xs">Algema</Badge>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1"><ArrowLeft className="mr-2 w-4 h-4" /> Voltar</Button>
                <Button onClick={onNext} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                    Concluir {totalItems > 0 ? `(+${totalItems} item${totalItems !== 1 ? "s" : ""})` : ""} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

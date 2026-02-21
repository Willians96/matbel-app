"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { searchArmas } from "@/server/queries/inventario";
import { Crosshair, ArrowRight, ArrowLeft, X, Plus } from "lucide-react";

type Arma = { id: number; name: string; patrimony: string; serialNumber: string; caliber: string | null; manufacturer: string | null };

interface Props {
    armas: Arma[];
    onUpdate: (armas: Arma[]) => void;
    onNext: () => void;
    onBack: () => void;
}

export function StepArmasTreino({ armas, onUpdate, onNext, onBack }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Array<Arma & { status: string }>>([]);
    const [isPending, start] = useTransition();

    function handleSearch(val: string) {
        setQuery(val);
        if (val.length >= 2) {
            start(async () => {
                const res = await searchArmas(val);
                // Filter out already added and non-available
                const ids = new Set(armas.map(a => a.id));
                setResults((res as Array<Arma & { status: string }>).filter(r => r.status === "disponivel" && !ids.has(r.id)));
            });
        } else {
            setResults([]);
        }
    }

    function add(a: Arma & { status: string }) {
        onUpdate([...armas, { id: a.id, name: a.name, patrimony: a.patrimony, serialNumber: a.serialNumber, caliber: a.caliber, manufacturer: a.manufacturer }]);
        setResults([]);
        setQuery("");
    }

    function remove(id: number) {
        onUpdate(armas.filter(a => a.id !== id));
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-2">
                    <Crosshair className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Armas para o Treinamento</h3>
                <p className="text-sm text-slate-500">Adicione todas as armas a serem entregues ao instrutor.</p>
            </div>

            {/* Lista de armas já adicionadas */}
            {armas.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Armas Adicionadas ({armas.length})</Label>
                    {armas.map((a) => (
                        <div key={a.id} className="flex items-center justify-between gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                            <div className="flex items-center gap-2">
                                <Crosshair className="w-4 h-4 text-orange-600 shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm text-orange-800">{a.name}</p>
                                    <p className="text-xs text-orange-700 font-mono">Pat: {a.patrimony} | Série: {a.serialNumber}</p>
                                </div>
                            </div>
                            <button type="button" onClick={() => remove(a.id)}
                                className="p-1 text-orange-400 hover:text-red-600 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Busca */}
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
                            <button key={a.id} type="button" onClick={() => add(a)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0">
                                <Plus className="w-4 h-4 text-green-600 shrink-0" />
                                <div>
                                    <p className="font-semibold text-sm">{a.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">Pat: {a.patrimony} | Série: {a.serialNumber}</p>
                                    {a.caliber && <p className="text-xs text-slate-400">{a.caliber}</p>}
                                </div>
                                <Badge className="ml-auto bg-green-100 text-green-800 border-green-200 text-xs">Disponível</Badge>
                            </button>
                        ))}
                    </div>
                )}
                {results.length === 0 && query.length >= 2 && !isPending && (
                    <p className="text-xs text-amber-600 text-center">Nenhuma arma disponível encontrada.</p>
                )}
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
                </Button>
                <Button onClick={onNext} disabled={armas.length === 0}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                    Próximo ({armas.length} arma{armas.length !== 1 ? "s" : ""}) <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

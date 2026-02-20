"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchUserByRe } from "@/server/actions/carga";
import type { CargaState } from "./wizard-carga";
import { UserSearch, ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
    state: CargaState;
    onUpdate: (p: Partial<CargaState>) => void;
    onNext: () => void;
}

export function StepRecebedor({ state, onUpdate, onNext }: Props) {
    const [query, setQuery] = useState(state.userRe ?? "");
    const [results, setResults] = useState<Array<{ id: string; name: string; re: string | null; rank: string | null; unit: string | null; warName: string | null }>>([]);
    const [isPending, start] = useTransition();

    function handleSearch(val: string) {
        setQuery(val);
        if (val.length >= 3) {
            start(async () => {
                const res = await searchUserByRe(val);
                setResults(res as typeof results);
            });
        } else {
            setResults([]);
        }
    }

    function select(u: typeof results[0]) {
        onUpdate({
            userId: u.id,
            userName: u.warName ?? u.name,
            userRe: u.re ?? "",
            userRank: u.rank ?? "",
            userUnit: u.unit ?? "",
        });
        setResults([]);
        setQuery(u.re ?? "");
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pm-blue/10 text-pm-blue mb-2">
                    <UserSearch className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Identificar o Recebedor</h3>
                <p className="text-sm text-slate-500">Pesquise pelo RE do policial para iniciar a carga.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="re-search">Nº RE do Policial</Label>
                <Input
                    id="re-search"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Digite o RE para buscar..."
                    className="text-lg font-mono"
                />

                {isPending && <p className="text-xs text-slate-400 text-center">Buscando...</p>}

                {results.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-1">
                        {results.map((u) => (
                            <button
                                key={u.id}
                                type="button"
                                onClick={() => select(u)}
                                className="w-full flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0"
                            >
                                <div className="w-9 h-9 rounded-full bg-pm-blue text-white flex items-center justify-center text-sm font-bold shrink-0">
                                    {(u.warName ?? u.name).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{u.rank} {u.warName ?? u.name}</p>
                                    <p className="text-xs text-slate-500">RE: {u.re} • {u.unit}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {state.userId && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                        <p className="font-bold text-green-800">{state.userRank} {state.userName}</p>
                        <p className="text-sm text-green-700">RE: {state.userRe} • {state.userUnit}</p>
                    </div>
                </div>
            )}

            <Button
                onClick={onNext}
                disabled={!state.userId}
                className="w-full bg-pm-blue text-white hover:bg-pm-blue/90"
            >
                Prosseguir <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </div>
    );
}

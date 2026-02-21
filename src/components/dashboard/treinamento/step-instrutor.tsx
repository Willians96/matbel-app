"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchUserByRe } from "@/server/actions/carga";
import { UserSearch, ArrowRight, CheckCircle2 } from "lucide-react";

type User = { id: string; name: string; re: string | null; rank: string | null; unit: string | null; warName: string | null };

interface Props {
    selected: { id: string; name: string; re: string; rank: string; unit: string } | null;
    onSelect: (u: { id: string; name: string; re: string; rank: string; unit: string }) => void;
    onNext: () => void;
}

export function StepInstrutor({ selected, onSelect, onNext }: Props) {
    const [query, setQuery] = useState(selected?.re ?? "");
    const [results, setResults] = useState<User[]>([]);
    const [isPending, start] = useTransition();

    function handleSearch(val: string) {
        setQuery(val);
        if (val.length >= 3) {
            start(async () => {
                const res = await searchUserByRe(val);
                setResults(res as User[]);
            });
        } else {
            setResults([]);
        }
    }

    function select(u: User) {
        onSelect({ id: u.id, name: u.warName ?? u.name, re: u.re ?? "", rank: u.rank ?? "", unit: u.unit ?? "" });
        setResults([]);
        setQuery(u.re ?? "");
    }

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-2">
                    <UserSearch className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Identificar o Instrutor</h3>
                <p className="text-sm text-slate-500">Busque pelo RE do instrutor responsável pelo treinamento.</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="re-search-treino">Nº RE do Instrutor</Label>
                <Input
                    id="re-search-treino"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Digite o RE para buscar..."
                    className="text-lg font-mono"
                />
                {isPending && <p className="text-xs text-slate-400 text-center">Buscando...</p>}
                {results.length > 0 && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-1">
                        {results.map((u) => (
                            <button key={u.id} type="button" onClick={() => select(u)}
                                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-0">
                                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
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

            {selected && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0" />
                    <div>
                        <p className="font-bold text-orange-800">{selected.rank} {selected.name}</p>
                        <p className="text-sm text-orange-700">RE: {selected.re} • {selected.unit}</p>
                    </div>
                </div>
            )}

            <Button onClick={onNext} disabled={!selected} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                Prosseguir <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </div>
    );
}

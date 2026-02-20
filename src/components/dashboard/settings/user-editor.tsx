"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { searchUserByRe, updateUserData } from "@/server/actions/settings";
import { Search, Save, UserPen, ChevronRight, Loader2, CircleX } from "lucide-react";

const RANKS = [
    "Cel PM", "TC PM", "Maj PM", "Cap PM", "1º Ten PM", "2º Ten PM",
    "Asp Of PM", "Sub Ten PM", "1º Sgt PM", "2º Sgt PM", "3º Sgt PM",
    "Cb PM", "Sd PM EP", "Sd PM 2ª Cl",
];

type UserData = {
    id: string;
    name: string;
    re: string | null;
    rank: string | null;
    warName: string | null;
    unit: string | null;
    role: string;
};

interface UserEditorProps {
    units: string[];
}

export function UserEditor({ units }: UserEditorProps) {
    const [searchRe, setSearchRe] = useState("");
    const [foundUser, setFoundUser] = useState<UserData | null>(null);

    // Editable fields
    const [name, setName] = useState("");
    const [re, setRe] = useState("");
    const [rank, setRank] = useState("");
    const [warName, setWarName] = useState("");
    const [unit, setUnit] = useState("");

    const [isPending, startTransition] = useTransition();
    const [isSaving, startSaving] = useTransition();

    const handleSearch = () => {
        if (!searchRe.trim()) {
            toast.warning("Digite um RE para pesquisar.");
            return;
        }
        startTransition(async () => {
            const result = await searchUserByRe(searchRe.trim());
            if (result.success && result.data) {
                const user = result.data as UserData;
                setFoundUser(user);
                setName(user.name || "");
                setRe(user.re || "");
                setRank(user.rank || "");
                setWarName(user.warName || "");
                setUnit(user.unit || "");
            } else {
                setFoundUser(null);
                toast.error(result.message ?? "Usuário não encontrado.");
            }
        });
    };

    const handleSave = () => {
        if (!foundUser) return;
        startSaving(async () => {
            const result = await updateUserData(foundUser.id, { name, re, rank, warName, unit });
            if (result.success) {
                toast.success(result.message ?? "Salvo!");
                setFoundUser({ ...foundUser, name, re, rank, warName, unit });
            } else {
                toast.error(result.message ?? "Erro ao salvar.");
            }
        });
    };

    const handleClear = () => {
        setFoundUser(null);
        setSearchRe("");
    };

    return (
        <div className="space-y-5">
            {/* Search */}
            <div className="flex gap-2">
                <Input
                    placeholder="Buscar por RE..."
                    value={searchRe}
                    onChange={(e) => setSearchRe(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="bg-slate-50 border-slate-200"
                />
                <Button
                    onClick={handleSearch}
                    disabled={isPending}
                    className="bg-pm-blue text-white hover:bg-pm-blue/90 shrink-0"
                >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span className="ml-1 hidden sm:inline">Buscar</span>
                </Button>
            </div>

            {/* User Editor Form */}
            {foundUser && (
                <div className="border border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* User Header */}
                    <div className="flex items-center justify-between bg-pm-blue/5 border-b border-slate-200 px-4 py-3">
                        <div className="flex items-center gap-2 text-pm-blue">
                            <UserPen className="w-4 h-4" />
                            <span className="font-semibold text-sm">Editando: RE {foundUser.re}</span>
                        </div>
                        <button onClick={handleClear} className="text-slate-400 hover:text-red-500 transition-colors">
                            <CircleX className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Fields */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nome Completo</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-white border-slate-300"
                                placeholder="Nome completo"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nome de Guerra</label>
                            <Input
                                value={warName}
                                onChange={(e) => setWarName(e.target.value)}
                                className="bg-white border-slate-300"
                                placeholder="Nome de guerra"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">RE</label>
                            <Input
                                value={re}
                                onChange={(e) => setRe(e.target.value)}
                                className="bg-white border-slate-300 font-mono"
                                placeholder="Registro Estatístico"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Posto/Graduação</label>
                            <Select value={rank} onValueChange={setRank}>
                                <SelectTrigger className="bg-white border-slate-300">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {RANKS.map((r) => (
                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Unidade</label>
                            <Select value={unit} onValueChange={setUnit}>
                                <SelectTrigger className="bg-white border-slate-300">
                                    <SelectValue placeholder="Selecione a unidade..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((u) => (
                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="border-t border-slate-100 px-4 py-3 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-900/10"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Salvar Alterações
                            {!isSaving && <ChevronRight className="w-3.5 h-3.5 ml-1" />}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

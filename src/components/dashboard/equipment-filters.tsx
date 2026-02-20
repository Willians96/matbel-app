
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui";
import { UNIDADES_PM } from "@/config/units";
import { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";

export function EquipmentFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [serialNumber, setSerialNumber] = useState(searchParams.get("serialNumber") || "");
    const [patrimony, setPatrimony] = useState(searchParams.get("patrimony") || "");
    const [unit, setUnit] = useState(searchParams.get("unit") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");
    const [userRe, setUserRe] = useState(searchParams.get("userRe") || "");

    // Update state when URL params change (e.g. clear filters)
    useEffect(() => {
        const sn = searchParams.get("serialNumber") || "";
        const pt = searchParams.get("patrimony") || "";
        const u = searchParams.get("unit") || "";
        const st = searchParams.get("status") || "";
        const re = searchParams.get("userRe") || "";

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSerialNumber((prev) => (prev === sn ? prev : sn));
        setPatrimony((prev) => (prev === pt ? prev : pt));
        setUnit((prev) => (prev === u ? prev : u));
        setStatus((prev) => (prev === st ? prev : st));
        setUserRe((prev) => (prev === re ? prev : re));
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (serialNumber) params.set("serialNumber", serialNumber);
        if (patrimony) params.set("patrimony", patrimony);
        if (unit && unit !== "all") params.set("unit", unit);
        if (status && status !== "all") params.set("status", status);
        if (userRe) params.set("userRe", userRe);

        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        setSerialNumber("");
        setPatrimony("");
        setUnit("");
        setStatus("");
        setUserRe("");
        router.push("?");
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold border-b pb-2 border-slate-100">
                <Filter className="w-4 h-4 text-pm-blue" />
                <h3>Filtros de Pesquisa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Serial</label>
                    <Input
                        placeholder="Digite o serial..."
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="bg-white border-slate-300 focus:border-pm-blue focus:ring-pm-blue/20"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">RE do Policial</label>
                    <Input
                        placeholder="Digite o RE..."
                        value={userRe}
                        onChange={(e) => setUserRe(e.target.value)}
                        className="bg-white border-slate-300 focus:border-pm-blue focus:ring-pm-blue/20"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Patrimônio</label>
                    <Input
                        placeholder="Digite o patrimônio..."
                        value={patrimony}
                        onChange={(e) => setPatrimony(e.target.value)}
                        className="bg-white border-slate-300 focus:border-pm-blue focus:ring-pm-blue/20"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Unidade</label>
                    <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger className="bg-white border-slate-300 focus:ring-pm-blue/20">
                            <SelectValue placeholder="Todas as Unidades" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas as Unidades</SelectItem>
                            {UNIDADES_PM.map((u) => (
                                <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="bg-white border-slate-300 focus:ring-pm-blue/20">
                            <SelectValue placeholder="Todos os Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="disponivel">Disponível</SelectItem>
                            <SelectItem value="em_uso">Em Uso</SelectItem>
                            <SelectItem value="manutencao">Manutenção</SelectItem>
                            <SelectItem value="baixado">Baixado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
                <Button
                    onClick={clearFilters}
                    className="bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors"
                >
                    <X className="w-4 h-4 mr-2" />
                    Limpar
                </Button>
                <Button
                    onClick={applyFilters}
                    className="bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md shadow-blue-900/10"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                </Button>
            </div>
        </div >
    );
}

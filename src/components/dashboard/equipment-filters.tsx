
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
import { Button } from "@/components/ui/button";
import { UNIDADES_PM } from "@/config/units";
import { useCallback, useState } from "react";
import { Search, X } from "lucide-react";

export function EquipmentFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for debouncing or controlled inputs
    const [serialNumber, setSerialNumber] = useState(searchParams.get("serialNumber") || "");
    const [patrimony, setPatrimony] = useState(searchParams.get("patrimony") || "");
    const [unit, setUnit] = useState(searchParams.get("unit") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "");

    // Update URL helper
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (serialNumber) params.set("serialNumber", serialNumber);
        if (patrimony) params.set("patrimony", patrimony);
        if (unit && unit !== "all") params.set("unit", unit);
        if (status && status !== "all") params.set("status", status);

        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        setSerialNumber("");
        setPatrimony("");
        setUnit("");
        setStatus("");
        router.push("?");
    };

    return (
        <div className="bg-slate-50 p-4 rounded-lg border flex flex-wrap gap-4 items-end">
            <div className="space-y-1 w-full sm:w-auto flex-1 min-w-[200px]">
                <span className="text-xs font-medium text-muted-foreground">Serial</span>
                <Input
                    placeholder="Buscar por Serial..."
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                />
            </div>

            <div className="space-y-1 w-full sm:w-auto flex-1 min-w-[200px]">
                <span className="text-xs font-medium text-muted-foreground">Patrimônio</span>
                <Input
                    placeholder="Buscar por Patrimônio..."
                    value={patrimony}
                    onChange={(e) => setSerialNumber(e.target.value)}
                />
            </div>

            <div className="space-y-1 w-full sm:w-auto w-[200px]">
                <span className="text-xs font-medium text-muted-foreground">Unidade</span>
                <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {UNIDADES_PM.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1 w-full sm:w-auto w-[150px]">
                <span className="text-xs font-medium text-muted-foreground">Status</span>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="em_uso">Em Uso</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="baixado">Baixado</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2">
                <Button onClick={applyFilters} className="bg-pm-blue hover:bg-pm-blue/90">
                    <Search className="w-4 h-4 mr-2" />
                    Filtrar
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Limpar
                </Button>
            </div>
        </div>
    );
}

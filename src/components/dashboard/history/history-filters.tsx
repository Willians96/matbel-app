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
import { useState, useEffect } from "react";
import { Search, X, Filter, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

export function HistoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from URL params
    const [serialNumber, setSerialNumber] = useState(searchParams.get("serialNumber") || "");
    const [userRe, setUserRe] = useState(searchParams.get("userRe") || "");
    const [type, setType] = useState(searchParams.get("type") || "");
    const [startDate, setStartDate] = useState<Date | undefined>(
        searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined
    );

    // Update state when URL params change
    useEffect(() => {
        const sn = searchParams.get("serialNumber") || "";
        const re = searchParams.get("userRe") || "";
        const t = searchParams.get("type") || "";
        const start = searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : undefined;
        const end = searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : undefined;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSerialNumber((prev) => (prev === sn ? prev : sn));
        setUserRe((prev) => (prev === re ? prev : re));
        setType((prev) => (prev === t ? prev : t));
        setStartDate((prev) => (prev?.getTime() === start?.getTime() ? prev : start));
        setEndDate((prev) => (prev?.getTime() === end?.getTime() ? prev : end));
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (serialNumber) params.set("serialNumber", serialNumber);
        if (userRe) params.set("userRe", userRe);
        if (type && type !== "all") params.set("type", type);
        if (startDate) params.set("startDate", startDate.toISOString());
        if (endDate) params.set("endDate", endDate.toISOString());

        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        setSerialNumber("");
        setUserRe("");
        setType("");
        setStartDate(undefined);
        setEndDate(undefined);
        router.push("?");
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold border-b pb-2 border-slate-100">
                <Filter className="w-4 h-4 text-pm-blue" />
                <h3>Filtros de Histórico</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Serial</label>
                    <Input
                        placeholder="Serial..."
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        className="bg-white border-slate-300 focus:border-pm-blue focus:ring-pm-blue/20"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">RE do Policial</label>
                    <Input
                        placeholder="RE..."
                        value={userRe}
                        onChange={(e) => setUserRe(e.target.value)}
                        className="bg-white border-slate-300 focus:border-pm-blue focus:ring-pm-blue/20"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Tipo de Ação</label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-white border-slate-300 focus:ring-pm-blue/20">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="allocation">Carga/Alocação</SelectItem>
                            <SelectItem value="return">Devolução</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Data Inicial</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal border-slate-300",
                                    !startDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione...</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
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
                    Pesquisar
                </Button>
            </div>
        </div>
    );
}

"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TransferHistoryItem } from "@/server/queries/history";
import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import { DownloadTermoButton } from "./download-termo-button";

interface HistoryTableClientProps {
    data: TransferHistoryItem[];
}

export function HistoryTableClient({ data }: HistoryTableClientProps) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                    <History className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Nenhum registro encontrado</h3>
                <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                    Tente ajustar os filtros de pesquisa para encontrar o que procura.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-semibold text-slate-700">Data/Hora</TableHead>
                        <TableHead className="font-semibold text-slate-700">Tipo</TableHead>
                        <TableHead className="font-semibold text-slate-700">Equipamento</TableHead>
                        <TableHead className="font-semibold text-slate-700 hidden md:table-cell">Policial (RE)</TableHead>
                        <TableHead className="font-semibold text-slate-700 hidden sm:table-cell">Status</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            <TableCell className="font-medium text-slate-700 text-sm">
                                {item.timestamp ? format(item.timestamp, "dd/MM/yy HH:mm", { locale: ptBR }) : "-"}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {item.type === "allocation" ? (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 gap-1 pl-1.5 shadow-none">
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                            Carga
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 gap-1 pl-1.5 shadow-none">
                                            <ArrowDownLeft className="w-3.5 h-3.5" />
                                            Devolução
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-800">{item.equipment.name}</span>
                                    <span className="text-xs text-slate-500 font-mono">S/N: {item.equipment.serialNumber}</span>
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-800">{item.user.name}</span>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <span className="font-semibold text-pm-blue bg-blue-50 px-1 rounded">{item.user.rank}</span>
                                        <span>•</span>
                                        <span className="font-mono">RE: {item.user.re || "N/A"}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge variant="outline" className="capitalize bg-slate-50 text-slate-600 border-slate-200 font-normal">
                                    {item.status.replace(/_/g, " ")}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DownloadTermoButton item={item} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

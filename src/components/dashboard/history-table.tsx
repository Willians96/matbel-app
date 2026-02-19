
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
import { TransferHistoryItem } from "@/server/queries/history";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface HistoryTableProps {
    data: TransferHistoryItem[];
}

export function HistoryTable({ data }: HistoryTableProps) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Policial</TableHead>
                        <TableHead>Responsável (Admin)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                Nenhuma movimentação registrada.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-xs text-muted-foreground">
                                    {item.timestamp ? format(item.timestamp, "dd/MM/yyyy HH:mm", { locale: ptBR }) : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            item.type === "allocation"
                                                ? "bg-blue-50 text-blue-700 border-blue-200 gap-1"
                                                : "bg-green-50 text-green-700 border-green-200 gap-1"
                                        }
                                    >
                                        {item.type === "allocation" ? (
                                            <>
                                                <ArrowRight className="w-3 h-3" /> Carga
                                            </>
                                        ) : (
                                            <>
                                                <ArrowLeft className="w-3 h-3" /> Devolução
                                            </>
                                        )}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.equipment.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.equipment.serialNumber}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{item.user.name}</span>
                                        <span className="text-xs text-muted-foreground">{item.user.rank} {item.user.re ? `(${item.user.re})` : ""}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-slate-600">
                                        {item.admin ? item.admin.name : "Sistema"}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { TreinamentoDetailsModal } from "./treinamento-details-modal";

type Treinamento = {
    id: string;
    status: string;
    createdAt: Date | null;
    instrutor: any;
    admin: any;
    munic: any;
    itemCount: number;
    municaoQty: number;
};

export function TreinamentoList({ initialData }: { initialData: Treinamento[] }) {
    if (initialData.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Target className="w-12 h-12 mb-2 opacity-20" />
                    <p>Nenhuma sessão de treinamento registrada.</p>
                </CardContent>
            </Card>
        );
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pending_acceptance": return { label: "Pendente Aceite", color: "bg-amber-100 text-amber-700" };
            case "confirmed": return { label: "Em Treinamento", color: "bg-green-100 text-green-700 font-bold" };
            case "returned": return { label: "Finalizado", color: "bg-slate-100 text-slate-700" };
            default: return { label: status, color: "bg-slate-100" };
        }
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Instrutor</TableHead>
                        <TableHead>Itens</TableHead>
                        <TableHead>Munição</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialData.map((t) => {
                        const status = getStatusLabel(t.status);
                        return (
                            <TableRow key={t.id}>
                                <TableCell className="text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{t.createdAt ? format(new Date(t.createdAt), "dd/MM/yyyy") : "—"}</span>
                                        <span className="text-xs text-slate-400">{t.createdAt ? format(new Date(t.createdAt), "HH:mm") : ""}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{t.instrutor?.name || "Desconhecido"}</span>
                                        <span className="text-xs text-slate-400">{t.instrutor?.rank} RE: {t.instrutor?.re}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                        <ShoppingBag className="w-3 h-3" />
                                        {t.itemCount} equipamentos
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {t.munic ? (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{t.municaoQty} un.</span>
                                            <span className="text-[10px] text-slate-400 uppercase">{t.munic.description}</span>
                                        </div>
                                    ) : "—"}
                                </TableCell>
                                <TableCell>
                                    <Badge className={status.color + " border-none"}>{status.label}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <TreinamentoDetailsModal trainingId={t.id} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
}

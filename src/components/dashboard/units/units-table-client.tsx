"use client";

import { useState } from "react";
import { Search, Trash2, ArrowUpDown, MoreHorizontal, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { deleteUnit } from "@/server/actions/units";

interface Unit {
    id: number;
    name: string;
    active: boolean | null;
    createdAt: Date | null;
}

interface UnitsTableClientProps {
    initialUnits: Unit[];
}

export function UnitsTableClient({ initialUnits }: UnitsTableClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Filter units based on search term
    const filteredUnits = initialUnits.filter((unit) =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function handleDelete(id: number) {
        setLoadingId(id);
        try {
            const result = await deleteUnit(id);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Erro ao remover unidade.");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground ml-2" />
                <Input
                    placeholder="Buscar unidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0"
                />
            </div>

            <Card className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                                        Nome da Unidade
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data de Criação</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUnits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ShieldCheck className="h-8 w-8 mb-2 opacity-20" />
                                            <p>Nenhuma unidade encontrada.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUnits.map((unit) => (
                                    <TableRow key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            #{unit.id.toString().padStart(4, '0')}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-900">
                                            {unit.name}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={unit.active ? "default" : "secondary"} className={unit.active ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                                {unit.active ? "Ativa" : "Inativa"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {unit.createdAt ? format(new Date(unit.createdAt), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                        disabled={loadingId === unit.id}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Excluir Unidade?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            A unidade <span className="font-bold text-slate-900">{unit.name}</span> será removida permanentemente.
                                                            Isso pode afetar equipamentos vinculados.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(unit.id)}
                                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                        >
                                                            {loadingId === unit.id ? "Excluindo..." : "Excluir"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="text-xs text-muted-foreground text-right">
                Total de registros: {filteredUnits.length}
            </div>
        </div>
    );
}

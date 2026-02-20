"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Crosshair, Shield, Link2, Zap } from "lucide-react";
import { AddArmaDialog } from "./add-arma-dialog";
import { AddColeteDialog } from "./add-colete-dialog";
import { AddAlgemaDialog } from "./add-algema-dialog";
import { AddMunicaoDialog } from "./add-municao-dialog";
import { InventarioImportDialog } from "./inventario-import-dialog";

type Arma = {
    id: number; patrimony: string; serialNumber: string; name: string;
    caliber: string | null; manufacturer: string | null; status: string;
};
type Colete = {
    id: number; patrimony: string; serialNumber: string; name: string;
    model: string | null; size: string | null; status: string; expiresAt: Date | null;
};
type Algema = {
    id: number; patrimony: string; serialNumber: string; name: string;
    brand: string | null; model: string | null; hasRegistry: boolean;
    availableQty: number; totalQty: number; status: string;
};
type Municao = {
    id: number; batch: string; description: string; type: string;
    availableQty: number; totalQty: number; expiresAt: Date | null;
};

interface InventarioClientProps {
    armas: Arma[];
    coletes: Colete[];
    algemas: Algema[];
    municoes: Municao[];
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string }> = {
        disponivel: { label: "Disponível", className: "bg-green-100 text-green-800 border-green-200" },
        em_uso: { label: "Em Uso", className: "bg-amber-100 text-amber-800 border-amber-200" },
        manutencao: { label: "Manutenção", className: "bg-red-100 text-red-800 border-red-200" },
        baixado: { label: "Baixado", className: "bg-slate-100 text-slate-600 border-slate-200" },
    };
    const { label, className } = map[status] ?? { label: status, className: "" };
    return <Badge className={className}>{label}</Badge>;
}

export function InventarioClient({ armas, coletes, algemas, municoes }: InventarioClientProps) {
    return (
        <Tabs defaultValue="armas" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6 bg-slate-100 p-1 rounded-xl h-auto">
                <TabsTrigger value="armas" className="flex items-center gap-2 data-[state=active]:bg-pm-blue data-[state=active]:text-white rounded-lg py-2 transition-all">
                    <Crosshair className="w-4 h-4" />
                    <span className="hidden sm:inline">Armas</span>
                    <Badge className="bg-white/20 text-inherit border-0">{armas.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="coletes" className="flex items-center gap-2 data-[state=active]:bg-pm-blue data-[state=active]:text-white rounded-lg py-2 transition-all">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Coletes</span>
                    <Badge className="bg-white/20 text-inherit border-0">{coletes.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="algemas" className="flex items-center gap-2 data-[state=active]:bg-pm-blue data-[state=active]:text-white rounded-lg py-2 transition-all">
                    <Link2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Algemas</span>
                    <Badge className="bg-white/20 text-inherit border-0">{algemas.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="municoes" className="flex items-center gap-2 data-[state=active]:bg-pm-blue data-[state=active]:text-white rounded-lg py-2 transition-all">
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Munições</span>
                    <Badge className="bg-white/20 text-inherit border-0">{municoes.length}</Badge>
                </TabsTrigger>
            </TabsList>

            {/* ─── Armas ─────────────────────────────────────────────────────── */}
            <TabsContent value="armas">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <Crosshair className="w-5 h-5 text-pm-blue" />
                                Armas Disponíveis
                            </CardTitle>
                            <CardDescription>Armamento da reserva apto para carga.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <InventarioImportDialog type="armas" />
                            <AddArmaDialog />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        {armas.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Crosshair className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="font-medium">Nenhuma arma cadastrada.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patrimônio</TableHead>
                                        <TableHead>Série</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="hidden md:table-cell">Calibre</TableHead>
                                        <TableHead className="hidden lg:table-cell">Fabricante</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {armas.map((a) => (
                                        <TableRow key={a.id}>
                                            <TableCell className="font-mono text-sm">{a.patrimony}</TableCell>
                                            <TableCell className="font-mono text-sm">{a.serialNumber}</TableCell>
                                            <TableCell className="font-medium">{a.name}</TableCell>
                                            <TableCell className="hidden md:table-cell text-slate-600">{a.caliber ?? "—"}</TableCell>
                                            <TableCell className="hidden lg:table-cell text-slate-600">{a.manufacturer ?? "—"}</TableCell>
                                            <TableCell><StatusBadge status={a.status} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ─── Coletes ───────────────────────────────────────────────────── */}
            <TabsContent value="coletes">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <Shield className="w-5 h-5 text-pm-blue" />
                                Coletes Disponíveis
                            </CardTitle>
                            <CardDescription>Coletes balísticos da reserva.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <InventarioImportDialog type="coletes" />
                            <AddColeteDialog />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        {coletes.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Shield className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="font-medium">Nenhum colete cadastrado.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patrimônio</TableHead>
                                        <TableHead>Série</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="hidden sm:table-cell">Tamanho</TableHead>
                                        <TableHead className="hidden md:table-cell">Modelo</TableHead>
                                        <TableHead className="hidden lg:table-cell">Validade</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coletes.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell className="font-mono text-sm">{c.patrimony}</TableCell>
                                            <TableCell className="font-mono text-sm">{c.serialNumber}</TableCell>
                                            <TableCell className="font-medium">{c.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {c.size ? <Badge className="bg-slate-100 text-slate-700 border-slate-200">{c.size}</Badge> : "—"}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-slate-600">{c.model ?? "—"}</TableCell>
                                            <TableCell className="hidden lg:table-cell text-slate-600 text-sm">
                                                {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("pt-BR") : "—"}
                                            </TableCell>
                                            <TableCell><StatusBadge status={c.status} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ─── Algemas ───────────────────────────────────────────────────── */}
            <TabsContent value="algemas">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <Link2 className="w-5 h-5 text-pm-blue" />
                                Algemas
                            </CardTitle>
                            <CardDescription>Algemas com e sem registro de patrimônio/série.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <InventarioImportDialog type="algemas" />
                            <AddAlgemaDialog />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        {algemas.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Link2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="font-medium">Nenhuma algema cadastrada.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patrimônio</TableHead>
                                        <TableHead>Série</TableHead>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="hidden sm:table-cell">Marca</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Qtd Disp.</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {algemas.map((a) => (
                                        <TableRow key={a.id}>
                                            <TableCell className="font-mono text-sm">
                                                {a.hasRegistry ? a.patrimony : <span className="text-slate-400 italic">Sem registro</span>}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {a.hasRegistry ? a.serialNumber : <span className="text-slate-400 italic">Sem registro</span>}
                                            </TableCell>
                                            <TableCell className="font-medium">{a.name}</TableCell>
                                            <TableCell className="hidden sm:table-cell text-slate-600">{a.brand ?? "—"}</TableCell>
                                            <TableCell>
                                                {a.hasRegistry
                                                    ? <Badge className="bg-blue-100 text-blue-800 border-blue-200">Rastreável</Badge>
                                                    : <Badge className="bg-orange-100 text-orange-800 border-orange-200">Pool</Badge>}
                                            </TableCell>
                                            <TableCell className="font-semibold text-pm-blue">
                                                {a.availableQty}/{a.totalQty}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ─── Munições ──────────────────────────────────────────────────── */}
            <TabsContent value="municoes">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <Zap className="w-5 h-5 text-pm-blue" />
                                Munições — Estoque da Reserva
                            </CardTitle>
                            <CardDescription>Controle rigoroso por lote. Estoque subtraído a cada carga.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <InventarioImportDialog type="municoes" />
                            <AddMunicaoDialog />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 overflow-x-auto">
                        {municoes.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                <p className="font-medium">Nenhum lote cadastrado.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lote</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                                        <TableHead className="hidden md:table-cell">Validade</TableHead>
                                        <TableHead>Disponível</TableHead>
                                        <TableHead className="hidden lg:table-cell">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {municoes.map((m) => {
                                        const pct = m.totalQty > 0 ? (m.availableQty / m.totalQty) * 100 : 0;
                                        return (
                                            <TableRow key={m.id}>
                                                <TableCell className="font-mono text-sm font-semibold">{m.batch}</TableCell>
                                                <TableCell className="font-medium">{m.description}</TableCell>
                                                <TableCell className="hidden sm:table-cell text-slate-600">{m.type}</TableCell>
                                                <TableCell className="hidden md:table-cell text-slate-600 text-sm">
                                                    {m.expiresAt ? new Date(m.expiresAt).toLocaleDateString("pt-BR") : "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-bold ${pct < 20 ? "text-red-600" : pct < 50 ? "text-amber-600" : "text-green-600"}`}>
                                                            {m.availableQty}
                                                        </span>
                                                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                                            <div
                                                                className={`h-full rounded-full ${pct < 20 ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-green-500"}`}
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell text-slate-500">{m.totalQty}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

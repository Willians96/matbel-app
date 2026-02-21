"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Eye,
    FileText,
    User,
    Calendar,
    Crosshair,
    Zap,
    Shield,
    Link2,
    CheckCircle2,
    Clock,
    RotateCcw
} from "lucide-react";
import { getTreinamentoWithDetails } from "@/server/actions/treinamento";
import { gerarTermoTreinamento } from "@/lib/pdf/termo-treinamento";
import { format } from "date-fns";

export function TreinamentoDetailsModal({ trainingId }: { trainingId: string }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    async function loadDetails() {
        setLoading(true);
        const res = await getTreinamentoWithDetails(trainingId);
        setData(res);
        setLoading(false);
    }

    const downloadPdf = () => {
        if (data) gerarTermoTreinamento(data);
    };

    return (
        <Dialog onOpenChange={(open) => open && loadDetails()}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Ver Detalhes">
                    <Eye className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Detalhes do Treinamento
                        {data && (
                            <Badge className={data.header.status === 'confirmed' ? 'bg-green-600' : 'bg-slate-200 text-slate-700'}>
                                {data.header.status === 'confirmed' ? 'Em Treino' : data.header.status === 'returned' ? 'Finalizado' : 'Pendente'}
                            </Badge>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Clock className="w-8 h-8 animate-spin text-pm-blue" />
                        </div>
                    ) : data ? (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Instrutor</span>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-pm-blue" />
                                        <span className="font-bold text-slate-800">{data.instutor?.name}</span>
                                    </div>
                                    <span className="text-xs text-slate-500 ml-6">{data.instutor?.rank} RE: {data.instutor?.re}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Responsável</span>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-pm-blue" />
                                        <span className="font-bold text-slate-800">{data.admin?.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Crosshair className="w-4 h-4" /> Equipamentos Vinculados
                                </h4>
                                <div className="grid gap-2">
                                    {data.itens.map((it: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                {it.type === 'arma' ? <Crosshair className="w-4 h-4 text-pm-blue" /> :
                                                    it.type === 'colete' ? <Shield className="w-4 h-4 text-amber-600" /> : <Link2 className="w-4 h-4 text-blue-600" />}
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{it.detail.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-mono italic">PAT: {it.detail.patrimony} | SN: {it.detail.serialNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ammunition */}
                            {data.header.municaoQty > 0 && (
                                <div className="p-4 bg-pm-blue/5 rounded-xl border border-pm-blue/10">
                                    <h4 className="text-sm font-bold text-pm-blue uppercase flex items-center gap-2 mb-3">
                                        <Zap className="w-4 h-4" /> Munição de Treino
                                    </h4>
                                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-pm-blue/10">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{data.munic?.description}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">LOTE: {data.munic?.batch}</span>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-pm-blue text-white">{data.header.municaoQty} unidades</Badge>
                                            {data.header.status === 'returned' && (
                                                <div className="text-[10px] mt-1 text-slate-500 flex items-center gap-1 justify-end">
                                                    <RotateCcw className="w-3 h-3" /> Devolvidas: {data.header.capsulesQty}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Signature / Dates */}
                            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-500">
                                <div className="flex justify-between">
                                    <span>Criado em:</span>
                                    <span>{data.header.createdAt ? format(new Date(data.header.createdAt), "dd/MM/yyyy HH:mm") : "-"}</span>
                                </div>
                                {data.header.confirmedAt && (
                                    <div className="flex justify-between">
                                        <span>Aceito em (Assinado):</span>
                                        <span>{format(new Date(data.header.confirmedAt), "dd/MM/yyyy HH:mm")}</span>
                                    </div>
                                )}
                                {data.header.returnedAt && (
                                    <div className="flex justify-between">
                                        <span>Devolvido em:</span>
                                        <span>{format(new Date(data.header.returnedAt), "dd/MM/yyyy HH:mm")}</span>
                                    </div>
                                )}
                                <div className="bg-slate-50 p-2 rounded font-mono text-[9px] break-all leading-tight">
                                    HASH: {data.header.signature || "Aguardando assinatura digital..."}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400">Erro ao carregar dados.</div>
                    )}
                </ScrollArea>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => (window as any).print()}>
                        Imprimir Tela
                    </Button>
                    <Button className="flex-1 bg-pm-blue hover:bg-blue-800 text-white font-bold gap-2" onClick={downloadPdf}>
                        Baixar Protocolo PDF <FileText className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

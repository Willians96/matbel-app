"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    Check,
    ArrowRight,
    Crosshair,
    Zap,
    Shield,
    Link2,
    RotateCcw,
    AlertCircle
} from "lucide-react";
import { acceptTreinamento, returnTreinamento } from "@/server/actions/treinamento";
import { gerarTermoTreinamento } from "@/lib/pdf/termo-treinamento";
import { toast } from "sonner";
import {
    FileText,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TreinamentoPendenteCardProps {
    treinamento: any; // Result from getTreinamentoWithDetails
}

export function TreinamentoPendenteCard({ treinamento }: TreinamentoPendenteCardProps) {
    const [pending, startTransition] = useTransition();
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [capsules, setCapsules] = useState(treinamento.header.municaoQty.toString());

    if (!treinamento) return null;

    const isPending = treinamento.header.status === "pending_acceptance";
    const isConfirmed = treinamento.header.status === "confirmed";

    async function handleAccept() {
        startTransition(async () => {
            const res = await acceptTreinamento(treinamento.header.id);
            if (res.success) {
                toast.success("Carga de treinamento aceita!");
                // Auto download receipt
                await gerarTermoTreinamento(treinamento);
            } else {
                toast.error(res.message);
            }
        });
    }

    async function handleReturn() {
        startTransition(async () => {
            const res = await returnTreinamento(treinamento.header.id, parseInt(capsules) || 0);
            if (res.success) {
                toast.success("Devolução registrada. Aguarde conferência do Admin.");
                setReturnDialogOpen(false);
                // Auto download return receipt
                await gerarTermoTreinamento({
                    ...treinamento,
                    header: { ...treinamento.header, status: "returned", capsulesQty: parseInt(capsules) || 0 }
                });
            } else {
                toast.error(res.message);
            }
        });
    }

    async function handleDownload() {
        await gerarTermoTreinamento(treinamento);
    }

    return (
        <Card className={`border-2 ${isPending ? "border-amber-200 bg-amber-50/30" : "border-pm-blue/20 bg-blue-50/30"} shadow-lg overflow-hidden`}>
            <div className={`p-1 text-center text-[10px] font-bold uppercase tracking-widest ${isPending ? "bg-amber-200 text-amber-800" : "bg-pm-blue text-white"}`}>
                {isPending ? "Aguardando seu aceite" : "Carga em Treinamento"}
            </div>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isPending ? "bg-amber-100 text-amber-600" : "bg-pm-blue/10 text-pm-blue"}`}>
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Carga de Treinamento</CardTitle>
                            <CardDescription>
                                Responsável: Instrutor {treinamento.instutor?.warName || treinamento.instutor?.name}
                            </CardDescription>
                        </div>
                    </div>
                    {isConfirmed && <Badge className="bg-green-600">Ativa</Badge>}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {treinamento.itens.map((it: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                            {it.type === "arma" && <Crosshair className="w-3 h-3 text-pm-blue" />}
                            {it.type === "colete" && <Shield className="w-3 h-3 text-amber-600" />}
                            {it.type === "algema" && <Link2 className="w-3 h-3 text-blue-600" />}
                            <span className="text-xs font-bold text-slate-700 truncate">{it.detail.name}</span>
                        </div>
                    ))}
                    {treinamento.header.municaoQty > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-pm-blue text-white rounded-lg shadow-sm overflow-hidden">
                            <Zap className="w-3 h-3 shrink-0" />
                            <span className="text-xs font-bold truncate">
                                {treinamento.header.municaoQty} un. {treinamento.munic?.description}
                            </span>
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex gap-2">
                    {isPending ? (
                        <Button
                            onClick={handleAccept}
                            disabled={pending}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 gap-2"
                        >
                            {pending ? "Processando..." : (
                                <>
                                    Aceitar Carga para Treino <Check className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-pm-blue hover:bg-blue-800 text-white font-bold h-12 gap-2">
                                    Devolver Carga <RotateCcw className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Devolução de Treinamento</DialogTitle>
                                    <DialogDescription>
                                        Informe a quantidade de cápsulas deflagradas para conferência.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="capsules">Quantidade de Cápsulas</Label>
                                        <div className="relative">
                                            <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                id="capsules"
                                                type="number"
                                                value={capsules}
                                                onChange={(e) => setCapsules(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            Originalmente entregue: {treinamento.header.municaoQty} unidades.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2">
                                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                        <p className="text-[10px] text-amber-800 font-medium leading-tight">
                                            Ao confirmar, o Admin deverá conferir o material fisicamente para finalizar a baixa.
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setReturnDialogOpen(false)}>Cancelar</Button>
                                    <Button
                                        onClick={handleReturn}
                                        disabled={pending}
                                        className="bg-pm-blue hover:bg-blue-800 text-white font-bold"
                                    >
                                        Confirmar Devolução
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {isConfirmed && (
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            className="w-full flex-1 border-pm-blue text-pm-blue hover:bg-pm-blue/5 font-bold h-12 gap-2"
                        >
                            Ver Recibo <FileText className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

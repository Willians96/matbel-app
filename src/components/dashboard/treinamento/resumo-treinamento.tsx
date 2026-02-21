"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Crosshair, Zap, Shield, Link2, UserCheck } from "lucide-react";

type Arma = { id: number; name: string; patrimony: string; serialNumber: string };
type Colete = { id: number; name: string; patrimony: string; serialNumber: string };
type Algema = { id: number; name: string; patrimony: string; serialNumber: string };
type Municio = { id: number; batch: string; description: string; type: string } | null;

interface Props {
    instrutor: { name: string; re: string; rank: string; unit: string } | null;
    armas: Arma[];
    coletes: Colete[];
    algemas: Algema[];
    munic: Municio;
    municQty: number;
    onBack: () => void;
    onConfirm: () => void;
    submitting: boolean;
}

export function ResumoTreinamento({ instrutor, armas, coletes, algemas, munic, municQty, onBack, onConfirm, submitting }: Props) {
    const totalItens = armas.length + coletes.length + algemas.length + (munic ? 1 : 0);

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Resumo do Treinamento</h3>
                <p className="text-sm text-slate-500">Confirme os itens antes de enviar a notificação ao instrutor.</p>
            </div>

            {/* Instrutor */}
            {instrutor && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <UserCheck className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Instrutor</span>
                    </div>
                    <p className="font-bold text-orange-800">{instrutor.rank} {instrutor.name}</p>
                    <p className="text-sm text-orange-700">RE: {instrutor.re} • {instrutor.unit}</p>
                </div>
            )}

            {/* Armas */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Armas ({armas.length})</span>
                </div>
                {armas.length === 0 ? (
                    <p className="text-sm text-slate-400 italic ml-6">Nenhuma arma adicionada</p>
                ) : (
                    armas.map(a => (
                        <div key={a.id} className="ml-6 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="font-medium text-sm">{a.name}</p>
                            <p className="text-xs text-slate-500 font-mono">Pat: {a.patrimony}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Munição */}
            {munic && municQty > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Munição</span>
                    </div>
                    <div className="ml-6 p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="font-medium text-sm">{munic.description}</p>
                        <p className="text-xs text-slate-500">Lote: {munic.batch} | <strong>{municQty} projéteis</strong></p>
                        <p className="text-xs text-amber-600 mt-0.5">⚠ Será subtraída do estoque. Retorna como estojos vazios.</p>
                    </div>
                </div>
            )}

            {/* Outros */}
            {(coletes.length > 0 || algemas.length > 0) && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Outros ({coletes.length + algemas.length})</span>
                    </div>
                    {coletes.map(c => (
                        <div key={c.id} className="ml-6 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="font-medium text-sm">{c.name} <span className="text-xs text-blue-600">(Colete)</span></p>
                        </div>
                    ))}
                    {algemas.map(a => (
                        <div key={a.id} className="ml-6 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="font-medium text-sm">{a.name} <span className="text-xs text-orange-600">(Algema)</span></p>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onBack} className="flex-1"><ArrowLeft className="mr-2 w-4 h-4" /> Voltar</Button>
                <Button onClick={onConfirm} disabled={submitting || armas.length === 0}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                    {submitting ? "Criando..." : "Criar Treinamento"}
                </Button>
            </div>
        </div>
    );
}

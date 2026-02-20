"use client";

import { Button } from "@/components/ui/button";
import type { CargaState } from "./wizard-carga";
import {
    Crosshair, Shield, Link2, Zap, User, ArrowLeft,
    CheckCircle2, Loader2, Send
} from "lucide-react";

interface Props {
    state: CargaState;
    onBack: () => void;
    onConfirm: () => void;
    submitting: boolean;
}

function ItemRow({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value?: string; sub?: string }) {
    if (!value) return (
        <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
            {icon}
            <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-sm text-slate-400 italic">Não incluído</p>
            </div>
        </div>
    );
    return (
        <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
            <div className="text-pm-blue">{icon}</div>
            <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
                {sub && <p className="text-xs text-slate-500">{sub}</p>}
            </div>
            <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
        </div>
    );
}

export function CargaSummary({ state, onBack, onConfirm, submitting }: Props) {
    const hasItems = state.arma || state.colete || state.algema || state.munic;

    return (
        <div className="space-y-5">
            <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-pm-blue/10 text-pm-blue mb-2">
                    <Send className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Confirmar Carga</h3>
                <p className="text-sm text-slate-500">Revise o resumo antes de criar a carga. O policial deverá aceitar digitalmente.</p>
            </div>

            {/* Policial */}
            <div className="p-4 bg-pm-blue/5 border border-pm-blue/20 rounded-xl">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-pm-blue" />
                    <div>
                        <p className="text-xs text-pm-blue/70 font-medium">Recebedor</p>
                        <p className="font-bold text-pm-blue">{state.userRank} {state.userName}</p>
                        <p className="text-sm text-pm-blue/80">RE: {state.userRe} • {state.userUnit}</p>
                    </div>
                </div>
            </div>

            {/* Item list */}
            <div className="border border-slate-200 rounded-xl px-4 bg-white">
                <ItemRow
                    icon={<Crosshair className="w-5 h-5" />}
                    label="Arma"
                    value={state.arma?.name}
                    sub={state.arma && `Pat: ${state.arma.patrimony} | ${state.arma.caliber ?? ""}`}
                />
                <ItemRow
                    icon={<Shield className="w-5 h-5" />}
                    label="Colete"
                    value={state.colete?.name}
                    sub={state.colete && `Pat: ${state.colete.patrimony} | Tam: ${state.colete.size ?? "—"}`}
                />
                <ItemRow
                    icon={<Link2 className="w-5 h-5" />}
                    label="Algema"
                    value={state.algema?.name}
                    sub={state.algema && (state.algema.hasRegistry
                        ? `Pat: ${state.algema.patrimony}`
                        : `Quantidade: ${state.algemaQty}`)}
                />
                <ItemRow
                    icon={<Zap className="w-5 h-5" />}
                    label="Munição"
                    value={state.munic?.description}
                    sub={state.munic && `Lote: ${state.munic.batch} | Qtd: ${state.municQty}`}
                />
            </div>

            {!hasItems && (
                <p className="text-center text-sm text-red-500 font-medium">
                    Adicione pelo menos um item antes de criar a carga.
                </p>
            )}

            <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} disabled={submitting} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Voltar
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={submitting || !state.userId || !hasItems}
                    className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md"
                >
                    {submitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Criando...</> : <><Send className="mr-2 w-4 h-4" /> Criar Carga</>}
                </Button>
            </div>
        </div>
    );
}

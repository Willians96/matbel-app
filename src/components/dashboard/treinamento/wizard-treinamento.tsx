"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTreinamento } from "@/server/actions/treinamento";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, ChevronLeft, Target, Save } from "lucide-react";
import { StepRecebedor } from "../carga/step-recebedor"; // Reuse instructor selection
import { StepMultiArma } from "./step-multi-arma";
import { StepMunicao } from "../carga/step-municao";
import { StepOutrosEquip } from "./step-outros-equip";
import { TreinamentoSummary } from "./treinamento-summary";

export type TreinamentoState = {
    userId?: string;
    userName?: string;
    userRe?: string;
    userRank?: string;
    userUnit?: string;
    armas: { id: number; name: string; patrimony: string; serialNumber: string }[];
    municao?: { id: number; batch: string; description: string; type: string; availableQty: number };
    municaoQty?: number;
    outros: { id: number; name: string; type: "colete" | "algema"; patrimony: string; serialNumber: string }[];
};

const STEPS = [
    { id: 0, label: "Instrutor", short: "1. Instrutor" },
    { id: 1, label: "Armas", short: "2. Armas" },
    { id: 2, label: "Munição", short: "3. Munição" },
    { id: 3, label: "Outros", short: "4. Outros" },
    { id: 4, label: "Confirmar", short: "5. Confirmar" },
];

export function WizardTreinamento({ municoes }: { municoes: any[] }) {
    const [step, setStep] = useState(0);
    const [state, setState] = useState<TreinamentoState>({
        armas: [],
        outros: []
    });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const update = (patch: Partial<TreinamentoState>) => setState((s) => ({ ...s, ...patch }));
    const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    async function handleConfirm() {
        if (!state.userId) return;
        setSubmitting(true);

        const items = [
            ...state.armas.map(a => ({ type: "arma" as const, id: a.id })),
            ...state.outros.map(o => ({ type: o.type, id: o.id }))
        ];

        const result = await createTreinamento({
            userId: state.userId,
            items,
            municaoId: state.municao?.id,
            municaoQty: state.municaoQty,
        });

        setSubmitting(false);
        if (result.success) {
            toast.success("Treinamento Criado!", { description: result.message });
            router.push("/dashboard/admin/treinamento");
            router.refresh();
        } else {
            toast.error("Erro ao Criar Treinamento", { description: result.message });
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1 gap-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all shrink-0
                            ${step === i ? "bg-pm-blue text-white border-pm-blue shadow-lg shadow-pm-blue/30" :
                                step > i ? "bg-green-500 text-white border-green-500" :
                                    "bg-white text-slate-400 border-slate-200"}`}>
                            {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-bold hidden md:block uppercase tracking-wider ${step >= i ? "text-pm-blue" : "text-slate-400"}`}>
                            {s.label}
                        </span>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${step > i ? "bg-green-500" : "bg-slate-200"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 min-h-[400px] flex flex-col">
                <div className="flex-1">
                    {step === 0 && (
                        <StepRecebedor
                            state={state as any}
                            onUpdate={update as any}
                            onNext={next}
                        />
                    )}
                    {step === 1 && (
                        <StepMultiArma
                            state={state}
                            onUpdate={update}
                            onNext={next}
                            onBack={back}
                        />
                    )}
                    {step === 2 && (
                        <StepMunicao
                            state={state as any}
                            onUpdate={update as any}
                            municoes={municoes}
                            onNext={next}
                            onBack={back}
                        />
                    )}
                    {step === 3 && (
                        <StepOutrosEquip
                            state={state}
                            onUpdate={update}
                            onNext={next}
                            onBack={back}
                        />
                    )}
                    {step === 4 && (
                        <TreinamentoSummary
                            state={state}
                            onBack={back}
                            onConfirm={handleConfirm}
                            submitting={submitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

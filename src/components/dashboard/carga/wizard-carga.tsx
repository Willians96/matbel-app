"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCarga } from "@/server/actions/carga";
import { toast } from "sonner";
import { StepRecebedor } from "./step-recebedor";
import { StepArma } from "./step-arma";
import { StepColete } from "./step-colete";
import { StepAlgema } from "./step-algema";
import { StepMunicao } from "./step-municao";
import { CargaSummary } from "./carga-summary";
import { CheckCircle2 } from "lucide-react";

type Municao = {
    id: number; batch: string; description: string; type: string;
    availableQty: number; totalQty: number; expiresAt: Date | null;
};

export type CargaState = {
    // Policial
    userId?: string;
    userName?: string;
    userRe?: string;
    userRank?: string;
    userUnit?: string;
    // Items
    arma?: { id: number; name: string; patrimony: string; serialNumber: string; caliber?: string | null; manufacturer?: string | null };
    colete?: { id: number; name: string; patrimony: string; serialNumber: string; model?: string | null; size?: string | null };
    algema?: { id: number; name: string; patrimony: string; serialNumber: string; hasRegistry: boolean; brand?: string | null; model?: string | null };
    algemaQty?: number;
    munic?: { id: number; batch: string; description: string; type: string; availableQty: number };
    municQty?: number;
};

const STEPS = [
    { id: 0, label: "Policial", short: "1. Policial" },
    { id: 1, label: "Arma", short: "2. Arma" },
    { id: 2, label: "Colete", short: "3. Colete" },
    { id: 3, label: "Algema", short: "4. Algema" },
    { id: 4, label: "Munição", short: "5. Munição" },
    { id: 5, label: "Confirmar", short: "6. Confirmar" },
];

export function WizardCarga({ municoes }: { municoes: Municao[] }) {
    const [step, setStep] = useState(0);
    const [state, setState] = useState<CargaState>({});
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const update = (patch: Partial<CargaState>) => setState((s) => ({ ...s, ...patch }));
    const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
    const back = () => setStep((s) => Math.max(s - 1, 0));

    async function handleConfirm() {
        if (!state.userId) return;
        setSubmitting(true);
        const result = await createCarga({
            userId: state.userId,
            armaId: state.arma?.id,
            coleteId: state.colete?.id,
            algemaId: state.algema?.id,
            algemaQty: state.algemaQty,
            municaoId: state.munic?.id,
            municaoQty: state.municQty,
        });
        setSubmitting(false);
        if (result.success) {
            toast.success("Carga Criada!", { description: result.message });
            router.refresh();
            // Reset wizard
            setState({});
            setStep(0);
        } else {
            toast.error("Erro ao Criar Carga", { description: result.message });
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-1">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center flex-1 gap-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all shrink-0
                            ${step === i ? "bg-pm-blue text-white border-pm-blue shadow-lg shadow-pm-blue/30" :
                                step > i ? "bg-green-500 text-white border-green-500" :
                                    "bg-white text-slate-400 border-slate-200"}`}>
                            {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-medium hidden sm:block ${step >= i ? "text-pm-blue" : "text-slate-400"}`}>
                            {s.label}
                        </span>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${step > i ? "bg-green-500" : "bg-slate-200"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                {step === 0 && <StepRecebedor state={state} onUpdate={update} onNext={next} />}
                {step === 1 && <StepArma state={state} onUpdate={update} onNext={next} onBack={back} />}
                {step === 2 && <StepColete state={state} onUpdate={update} onNext={next} onBack={back} />}
                {step === 3 && <StepAlgema state={state} onUpdate={update} onNext={next} onBack={back} />}
                {step === 4 && <StepMunicao state={state} onUpdate={update} municoes={municoes} onNext={next} onBack={back} />}
                {step === 5 && <CargaSummary state={state} onBack={back} onConfirm={handleConfirm} submitting={submitting} />}
            </div>
        </div>
    );
}

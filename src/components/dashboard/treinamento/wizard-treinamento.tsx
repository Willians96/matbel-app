"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTreinamento } from "@/server/actions/treinamento";
import { toast } from "sonner";
import { StepInstrutor } from "./step-instrutor";
import { StepArmasTreino } from "./step-armas-treino";
import { StepMunicaoTreino } from "./step-municao-treino";
import { StepOutrosItens } from "./step-outros-itens";
import { ResumoTreinamento } from "./resumo-treinamento";
import { CheckCircle2 } from "lucide-react";

type Arma = { id: number; name: string; patrimony: string; serialNumber: string; caliber: string | null; manufacturer: string | null };
type Colete = { id: number; name: string; patrimony: string; serialNumber: string; model: string | null; size: string | null };
type Algema = { id: number; name: string; patrimony: string; serialNumber: string; brand: string | null; hasRegistry: boolean };
type Municao = { id: number; batch: string; description: string; type: string; availableQty: number; totalQty: number; expiresAt: Date | null };

const STEPS = [
    { label: "Instrutor" },
    { label: "Armas" },
    { label: "Munição" },
    { label: "Outros" },
    { label: "Confirmar" },
];

interface Props {
    municoes: Municao[];
}

export function WizardTreinamento({ municoes }: Props) {
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    // State
    const [instrutor, setInstrutor] = useState<{ id: string; name: string; re: string; rank: string; unit: string } | null>(null);
    const [armas, setArmas] = useState<Arma[]>([]);
    const [coletes, setColetes] = useState<Colete[]>([]);
    const [algemas, setAlgemas] = useState<Algema[]>([]);
    const [munic, setMunic] = useState<{ id: number; batch: string; description: string; type: string; availableQty: number } | null>(null);
    const [municQty, setMunicQty] = useState(0);

    const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
    const back = () => setStep(s => Math.max(s - 1, 0));

    async function handleConfirm() {
        if (!instrutor) return;
        setSubmitting(true);
        try {
            const result = await createTreinamento({
                userId: instrutor.id,
                armaIds: armas.map(a => a.id),
                coleteIds: coletes.map(c => c.id),
                algemaIds: algemas.map(a => a.id),
                municaoId: munic?.id,
                municaoQty: munic ? municQty : 0,
            });
            if (result.success) {
                toast.success("Treinamento Criado!", {
                    description: `Notificação enviada ao instrutor ${instrutor.name}.`,
                });
                router.refresh();
                // Reset
                setStep(0); setInstrutor(null); setArmas([]); setColetes([]); setAlgemas([]); setMunic(null); setMunicQty(0);
            } else {
                toast.error("Erro", { description: "Não foi possível criar o treinamento." });
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center gap-1">
                {STEPS.map((s, i) => (
                    <div key={i} className="flex items-center flex-1 gap-1">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-all shrink-0
                            ${step === i ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-200" :
                                step > i ? "bg-green-500 text-white border-green-500" :
                                    "bg-white text-slate-400 border-slate-200"}`}>
                            {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-medium hidden sm:block ${step >= i ? "text-orange-600" : "text-slate-400"}`}>
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
                {step === 0 && <StepInstrutor selected={instrutor} onSelect={setInstrutor} onNext={next} />}
                {step === 1 && <StepArmasTreino armas={armas} onUpdate={setArmas} onNext={next} onBack={back} />}
                {step === 2 && <StepMunicaoTreino municoes={municoes} selected={munic} qty={municQty}
                    onUpdate={(m, q) => { setMunic(m); setMunicQty(q); }} onNext={next} onBack={back} />}
                {step === 3 && <StepOutrosItens coletes={coletes} algemas={algemas}
                    onUpdate={(c, a) => { setColetes(c); setAlgemas(a); }} onNext={next} onBack={back} />}
                {step === 4 && <ResumoTreinamento instrutor={instrutor} armas={armas} coletes={coletes}
                    algemas={algemas} munic={munic} municQty={municQty} onBack={back}
                    onConfirm={handleConfirm} submitting={submitting} />}
            </div>
        </div>
    );
}

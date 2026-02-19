"use client";

import { useTransition } from "react";
import { confirmTransfer, rejectTransfer } from "@/server/actions/transfers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, XCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface TransferProps {
    transfer: {
        id: string;
        type: "allocation" | "return";
        createdAt: Date | null;
        equipment: {
            name: string;
            serialNumber: string;
            patrimony: string | null;
        };
    };
}

export function TransferCard({ transfer }: TransferProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const isReturn = transfer.type === "return";

    function handleConfirm() {
        startTransition(async () => {
            const result = await confirmTransfer(transfer.id);
            if (result.success) {
                toast.success("Confirmado!", {
                    description: isReturn
                        ? "Devolução processada. Equipamento disponível."
                        : "O recibo digital foi gerado e o item agora consta em sua carga."
                });
                router.refresh();
            } else {
                toast.error("Erro", { description: result.message });
            }
        });
    }

    function handleReject() {
        startTransition(async () => {
            const result = await rejectTransfer(transfer.id);
            if (result.success) {
                toast.info("Transferência Rejeitada");
                router.refresh();
            } else {
                toast.error("Erro", { description: result.message });
            }
        });
    }

    return (
        <Card className={`border-l-4 shadow-sm relative overflow-hidden ${isReturn ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className={`w-24 h-24 ${isReturn ? 'text-amber-600' : 'text-blue-600'}`} />
            </div>

            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    {isReturn ? (
                        <>
                            <ArrowRight className="w-5 h-5 text-amber-600 rotate-180" />
                            Devolução de Material
                        </>
                    ) : (
                        <>
                            <ArrowRight className="w-5 h-5 text-blue-600" />
                            Entrega de Material
                        </>
                    )}
                </CardTitle>
                <CardDescription>
                    {isReturn
                        ? "Usuário solicitou a devolução deste item."
                        : "A administração enviou um item para sua carga pessoal."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 relative z-10">
                    <h4 className="font-semibold text-slate-900">{transfer.equipment.name}</h4>
                    <div className="text-sm text-slate-600 mt-1 grid grid-cols-2 gap-2">
                        <span>Serial: <span className="font-mono text-slate-800">{transfer.equipment.serialNumber}</span></span>
                        {transfer.equipment.patrimony && (
                            <span>Patrimônio: <span className="font-mono text-slate-800">{transfer.equipment.patrimony}</span></span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Solicitado em: {transfer.createdAt ? new Date(transfer.createdAt).toLocaleDateString() : "-"}
                </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-2 relative z-10">
                <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleReject}
                    disabled={isPending}
                >
                    <XCircle className="w-4 h-4 mr-2" /> Recusar
                </Button>
                <Button
                    className={`${isReturn ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    onClick={handleConfirm}
                    disabled={isPending}
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isPending ? "Processando..." : (isReturn ? "Confirmar Devolução" : "Assinar e Receber")}
                </Button>
            </CardFooter>
        </Card>
    );
}

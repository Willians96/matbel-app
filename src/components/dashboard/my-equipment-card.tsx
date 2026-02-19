"use client";

import { useTransition, useState } from "react";
import { createTransfer } from "@/server/actions/transfers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArchiveRestore, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EquipmentProps {
    equipment: {
        id: number;
        name: string;
        serialNumber: string;
        patrimony: string | null;
        status: "disponivel" | "em_uso" | "manutencao" | "baixado";
    };
}

export function MyEquipmentCard({ equipment }: EquipmentProps) {
    const [isPending, startTransition] = useTransition();
    const [isConfirming, setIsConfirming] = useState(false);

    function handleReturn() {
        startTransition(async () => {
            const result = await createTransfer("return", equipment.id, ""); // TargetUser is ignored for return
            if (result.success) {
                toast.success("Solicitação enviada!", {
                    description: "A administração foi notificada da devolução. Aguarde a confirmação."
                });
                setIsConfirming(false);
            } else {
                toast.error("Erro", { description: result.message });
            }
        });
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold">{equipment.name}</CardTitle>
                    <Badge variant="outline" className="bg-white">Em Uso</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-muted-foreground block text-xs">Serial</span>
                        <span className="font-mono">{equipment.serialNumber}</span>
                    </div>
                    {equipment.patrimony && (
                        <div>
                            <span className="text-muted-foreground block text-xs">Patrimônio</span>
                            <span className="font-mono">{equipment.patrimony}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t pt-3">
                {isConfirming ? (
                    <div className="flex w-full gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={handleReturn}
                            disabled={isPending}
                        >
                            <Check className="w-4 h-4" />
                            {isPending ? "..." : "Confirmar"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsConfirming(false)}
                            disabled={isPending}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setIsConfirming(true)}
                    >
                        <ArchiveRestore className="w-4 h-4" />
                        Devolver Material
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

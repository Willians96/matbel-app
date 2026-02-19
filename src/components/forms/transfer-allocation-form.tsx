"use client";

import { useFormStatus } from "react-dom";
import { createTransfer } from "@/server/actions/transfers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

interface AllocationFormProps {
    users: { id: string; name: string; re: string | null; unit: string | null }[];
    equipments: { id: number; name: string; serialNumber: string; patrimony: string | null }[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full bg-pm-blue text-white hover:bg-pm-blue/90" disabled={pending}>
            {pending ? "Processando..." : "Enviar Solicitação de Entrega"}
        </Button>
    );
}

export function TransferAllocationForm({ users, equipments }: AllocationFormProps) {
    const router = useRouter();

    async function clientAction(formData: FormData) {
        const userId = formData.get("userId") as string;
        const equipmentId = Number(formData.get("equipmentId"));

        if (!userId || !equipmentId) {
            toast.error("Selecione usuário e equipamento.");
            return;
        }

        const result = await createTransfer("allocation", equipmentId, userId);

        if (result.success) {
            toast.success("Solicitação Criada!", {
                description: "O usuário deve confirmar o recebimento no painel dele."
            });
            router.push("/dashboard/equipment");
            router.refresh();
        } else {
            toast.error("Erro", { description: result.message });
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/equipment">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">Entregar Material</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Nova Cautela</CardTitle>
                    <CardDescription>
                        Selecione o policial e o equipamento. Será gerada uma solicitação pendente de confirmação.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={clientAction} className="space-y-6">

                        <div className="space-y-2">
                            <Label>Policial (Destinatário)</Label>
                            <Select name="userId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o policial..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.re ? `${user.re} - ` : ""}{user.name} {user.unit ? `(${user.unit})` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Equipamento Disponível</Label>
                            <Select name="equipmentId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o equipamento..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {equipments.map((eq) => (
                                        <SelectItem key={eq.id} value={String(eq.id)}>
                                            {eq.serialNumber} - {eq.name} {eq.patrimony ? `(Pat: ${eq.patrimony})` : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4">
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

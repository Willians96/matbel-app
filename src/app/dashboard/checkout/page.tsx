"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { processCheckout, CheckoutState } from "@/server/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UNIDADES_PM } from "@/config/units";
import { AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";

const initialState: CheckoutState = {
    success: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full bg-pm-blue hover:bg-pm-blue/90" disabled={pending}>
            {pending ? "Processando..." : "Confirmar Retirada (Cautela)"}
        </Button>
    );
}

export default function CheckoutPage() {
    const [state, formAction] = useFormState(processCheckout, initialState);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pm-blue text-white rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Cautela de Material</h2>
                    <p className="text-muted-foreground">
                        Registro de retirada de armamento e equipamentos.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dados da Retirada</CardTitle>
                    <CardDescription>Preencha os dados do Policial e do Equipamento.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="userRe">RE do Policial</Label>
                                <Input id="userRe" name="userRe" placeholder="Ex: 123456-7" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="userName">Nome de Guerra</Label>
                                <Input id="userName" name="userName" placeholder="Ex: Sd PM Silva" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="userUnit">Unidade</Label>
                            <Select name="userUnit" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a unidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {UNIDADES_PM.map((u) => (
                                        <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-slate-50 border rounded-lg space-y-2">
                            <Label htmlFor="serialNumber" className="text-base font-semibold">Serial do Equipamento (Leitor/Digitação)</Label>
                            <Input
                                id="serialNumber"
                                name="serialNumber"
                                placeholder="Bipe ou digite o serial..."
                                className="text-lg py-6 font-mono tracking-wider"
                                autoFocus
                                required
                            />
                            <p className="text-xs text-muted-foreground">O equipamento deve estar com status "Disponível".</p>
                        </div>

                        {state.message && (
                            <div className={`p-4 rounded-md flex items-center gap-2 ${state.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                {state.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="font-medium">{state.message}</span>
                            </div>
                        )}

                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

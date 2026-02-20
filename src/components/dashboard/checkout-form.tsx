"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { processCheckout, CheckoutState } from "@/server/actions/checkout";
import { getUserByRE } from "@/server/actions/user-lookup";
import { Button } from "@/components/ui";
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
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const initialState: CheckoutState = {
    success: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full bg-pm-blue text-white hover:bg-pm-blue/90" disabled={pending}>
            {pending ? "Processando..." : "Confirmar Retirada"}
        </Button>
    );
}

export function CheckoutForm() {
    const [state, formAction] = useFormState(processCheckout, initialState);
    const [loadingUser, setLoadingUser] = useState(false);

    // Auto-fill states
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");

    async function handleREBlur(e: React.FocusEvent<HTMLInputElement>) {
        const re = e.target.value;
        if (re.length > 3) {
            setLoadingUser(true);
            const user = await getUserByRE(re);
            if (user) {
                // Combine Rank + Name for display if available
                const fullName = user.rank ? `${user.rank} ${user.name}` : user.name;
                setName(fullName);
                setUnit(user.unit || "");
            }
            setLoadingUser(false);
        }
    }

    // Toast notification effect
    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success("Sucesso!", { description: state.message });
            } else {
                toast.error("Erro!", { description: state.message });
            }
        }
    }, [state]);

    return (
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
                            <Input
                                id="userRe"
                                name="userRe"
                                placeholder="Ex: 123456-7"
                                required
                                onBlur={handleREBlur}
                            />
                            {loadingUser && <p className="text-xs text-muted-foreground animate-pulse">Buscando cadastro...</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="userName">Nome de Guerra</Label>
                            <Input
                                id="userName"
                                name="userName"
                                placeholder="Ex: Sd PM Silva"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userUnit">Unidade</Label>
                        <Select name="userUnit" required value={unit} onValueChange={setUnit}>
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
                        <p className="text-xs text-muted-foreground">O equipamento deve estar com status &quot;Disponível&quot;.</p>
                    </div>

                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}

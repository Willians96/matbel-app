"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { updateProfile, ProfileState } from "@/server/actions/profile";
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
import { toast } from "sonner";
import { useEffect } from "react";

const initialState: ProfileState = {
    success: false,
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full bg-pm-blue hover:bg-pm-blue/90" disabled={pending}>
            {pending ? "Salvando..." : "Salvar Dados"}
        </Button>
    );
}

interface ProfileFormProps {
    initialData?: {
        re?: string | null;
        rank?: string | null;
        warName?: string | null;
        unit?: string | null;
    } | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [state, formAction] = useFormState(updateProfile, initialState);

    // Toast notification effect
    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success("Perfil Atualizado!", { description: state.message });
            } else {
                toast.error("Erro ao Salvar", { description: state.message });
            }
        }
    }, [state]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Dados Profissionais</CardTitle>
                <CardDescription>Estes dados serão usados nas cautelas.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="re">RE (Registro Estatístico)</Label>
                        <Input
                            id="re"
                            name="re"
                            placeholder="Ex: 123456-7"
                            defaultValue={initialData?.re || ""}
                            required
                        />
                        <p className="text-xs text-muted-foreground">Digite apenas números e dígito.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="rank">Posto/Graduação</Label>
                            <Select name="rank" defaultValue={initialData?.rank || ""} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sd PM">Soldado</SelectItem>
                                    <SelectItem value="Cb PM">Cabo</SelectItem>
                                    <SelectItem value="3º Sgt PM">3º Sargento</SelectItem>
                                    <SelectItem value="2º Sgt PM">2º Sargento</SelectItem>
                                    <SelectItem value="1º Sgt PM">1º Sargento</SelectItem>
                                    <SelectItem value="Subten PM">Subtenente</SelectItem>
                                    <SelectItem value="Asp Of PM">Aspirante</SelectItem>
                                    <SelectItem value="2º Ten PM">2º Tenente</SelectItem>
                                    <SelectItem value="1º Ten PM">1º Tenente</SelectItem>
                                    <SelectItem value="Cap PM">Capitão</SelectItem>
                                    <SelectItem value="Maj PM">Major</SelectItem>
                                    <SelectItem value="Ten Cel PM">Tenente Coronel</SelectItem>
                                    <SelectItem value="Cel PM">Coronel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="warName">Nome de Guerra</Label>
                            <Input
                                id="warName"
                                name="warName"
                                placeholder="Ex: Silva"
                                defaultValue={initialData?.warName || ""}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="unit">Unidade</Label>
                        <Select name="unit" defaultValue={initialData?.unit || ""} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione sua unidade..." />
                            </SelectTrigger>
                            <SelectContent>
                                {UNIDADES_PM.map((u) => (
                                    <SelectItem key={u} value={u}>{u}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { declarationSchema } from "@/lib/validations/declaration"
import { createDeclaration } from "@/server/actions/declarations"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// ... imports

interface DeclarationFormProps {
    initialData?: {
        gunSerialNumber?: string | null;
        vestSerialNumber?: string | null;
        hasHandcuffs?: boolean | null;
        handcuffsSerialNumber?: string | null;
    } | null;
}

export function DeclarationForm({ initialData }: DeclarationFormProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(declarationSchema),
        defaultValues: {
            gunSerialNumber: initialData?.gunSerialNumber || "",
            vestSerialNumber: initialData?.vestSerialNumber || "",
            hasHandcuffs: initialData?.hasHandcuffs || false,
            handcuffsSerialNumber: initialData?.handcuffsSerialNumber || "",
        },
    })
    // ... rest of component

    const hasHandcuffs = form.watch("hasHandcuffs");

    async function onSubmit(values: z.infer<typeof declarationSchema>) {
        setIsPending(true);
        try {
            const result = await createDeclaration(values);
            if (result.success) {
                toast.success("Sucesso!", { description: result.message });
                router.push("/dashboard/profile");
            } else {
                toast.error("Erro", { description: result.message });
            }
        } catch (error) {
            toast.error("Erro de Sistema", { description: "Tente novamente mais tarde." });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Declaração de Material Permanente</CardTitle>
                <CardDescription>
                    Informe os equipamentos que estão sob sua cautela permanente (Carga Pessoal).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="gunSerialNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Armamento (Serial)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: S123456" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Número de série da pistola/arma.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="vestSerialNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Colete Balístico (Serial)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 987654321" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Número do painel balístico.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
                            <FormField
                                control={form.control}
                                name="hasHandcuffs"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value === true}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Possuo Algema
                                            </FormLabel>
                                            <FormDescription>
                                                Marque se você possui algema cautelada.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {hasHandcuffs && (
                                <FormField
                                    control={form.control}
                                    name="handcuffsSerialNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serial da Algema</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: ALG-001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-pm-blue text-white hover:bg-pm-blue/90">
                                {isPending ? "Enviando..." : "Enviar Declaração"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

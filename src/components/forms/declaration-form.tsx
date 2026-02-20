"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui"
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
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface DeclarationFormProps {
    initialData?: {
        gunSerialNumber?: string | null;
        vestSerialNumber?: string | null;
        hasHandcuffs?: boolean | null;
        handcuffsSerialNumber?: string | null;
        status?: string | null;
        adminNotes?: string | null;
    } | null;
}

export function DeclarationForm({ initialData }: DeclarationFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [isEditing, setIsEditing] = useState(!initialData); // If no data, start in edit mode
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

    // Status Logic
    const status = initialData?.status || 'new';
    const isApproved = status === 'approved';
    const isPendingApproval = status === 'pending';
    const isRejected = status === 'rejected';

    const canEdit = isEditing || isRejected || status === 'new';
    const showAdminNote = (isRejected || isApproved) && initialData?.adminNotes;

    async function onSubmit(values: z.infer<typeof declarationSchema>) {
        setIsPending(true);
        try {
            const result = await createDeclaration(values);
            if (result.success) {
                toast.success("Solicitação Enviada!", { description: "Aguarde a conferência do admin." });
                setIsEditing(false); // Lock form
                router.refresh(); // Refresh to get new 'pending' status
            } else {
                toast.error("Erro", { description: result.message });
            }
        } catch {
            toast.error("Erro de Sistema", { description: "Tente novamente mais tarde." });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Declaração de Material Permanente</CardTitle>
                        <CardDescription>
                            Informe os equipamentos que estão sob sua carga permanente.
                        </CardDescription>
                    </div>
                    {/* Status Badges */}
                    {isApproved && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> Aprovado
                        </div>
                    )}
                    {isPendingApproval && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            <Clock className="w-4 h-4" /> Em Análise
                        </div>
                    )}
                    {isRejected && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            <AlertCircle className="w-4 h-4" /> Rejeitado
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {showAdminNote && (
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
                        <span className="font-semibold block mb-1">Nota do Administrador:</span>
                        {initialData?.adminNotes}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <fieldset disabled={!canEdit} className="space-y-6 group-disabled:opacity-80">
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
                                                    Marque se você possui algema em carga permanente.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {form.watch("hasHandcuffs") && (
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
                        </fieldset>

                        <div className="flex justify-end gap-3">
                            {!canEdit ? (
                                <Button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                                    className="bg-pm-blue text-white hover:bg-pm-blue/90"
                                >
                                    Solicitar Alteração
                                </Button>
                            ) : (
                                <>
                                    {initialData && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={isPending} className="bg-pm-blue text-white hover:bg-pm-blue/90">
                                        {isPending ? "Enviando..." : (initialData ? "Atualizar Solicitação" : "Enviar Declaração")}
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

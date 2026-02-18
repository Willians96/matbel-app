"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { equipmentSchema } from "@/lib/validations/equipment"
import { createEquipment } from "@/server/actions/equipment"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EquipmentFormProps {
    units?: string[];
}

export function EquipmentForm({ units }: EquipmentFormProps) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    // Fallback units if none provided
    const availableUnits = units && units.length > 0 ? units : ["CPI-7", "10 BPM-I", "11 BPM-I"];

    const form = useForm<z.infer<typeof equipmentSchema>>({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            name: "",
            serialNumber: "",
            patrimony: "",
            category: "",
            status: "disponivel",
            unit: "", // Added unit field
            observations: "",
        },
    })

    async function onSubmit(values: z.infer<typeof equipmentSchema>) {
        setIsPending(true);

        try {
            const result = await createEquipment(values);

            if (result.success) {
                toast.success("Equipamento Cadastrado!", { description: result.message });
                form.reset();
                router.refresh();
            } else {
                toast.error("Erro ao Cadastrar", { description: result.message });
            }
        } catch (error) {
            toast.error("Erro de Conexão", { description: "Tente novamente mais tarde." });
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Equipamento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Glock G22" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Unidade de Dotação</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione a unidade" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {availableUnits.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="serialNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Série</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: S123456" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="patrimony"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Patrimônio (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: P-98765" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Pistola" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="disponivel">Disponível</SelectItem>
                                        <SelectItem value="em_uso">Em Uso</SelectItem>
                                        <SelectItem value="manutencao">Em Manutenção</SelectItem>
                                        <SelectItem value="baixado">Baixado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                                <Input placeholder="Detalhes adicionais..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending} className="w-full md:w-auto bg-pm-blue hover:bg-pm-blue/90">
                    {isPending ? "Salvando..." : "Cadastrar Equipamento"}
                </Button>
            </form>
        </Form>
    )
}

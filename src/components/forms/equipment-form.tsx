
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { equipmentSchema } from "@/lib/validations/equipment"
import { createEquipment } from "@/server/actions/equipment"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function EquipmentForm() {
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const form = useForm<z.infer<typeof equipmentSchema>>({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            name: "",
            serialNumber: "",
            category: "",
            status: "disponivel",
            observations: "",
        },
    })

    async function onSubmit(values: z.infer<typeof equipmentSchema>) {
        setIsPending(true);
        setMessage("");

        const result = await createEquipment(values);

        setIsPending(false);
        if (result.success) {
            setMessage("✅ " + result.message);
            form.reset();
            router.refresh();
        } else {
            setMessage("❌ " + result.message);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">

                {message && (
                    <div className={`p-4 rounded-md ${message.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {message}
                    </div>
                )}

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

                <div className="grid grid-cols-2 gap-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                                <FormControl>
                                    <select
                                        {...field}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="disponivel">Disponível</option>
                                        <option value="em_uso">Em Uso</option>
                                        <option value="manutencao">Em Manutenção</option>
                                        <option value="baixado">Baixado</option>
                                    </select>
                                </FormControl>
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

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Salvando..." : "Cadastrar Equipamento"}
                </Button>
            </form>
        </Form>
    )
}

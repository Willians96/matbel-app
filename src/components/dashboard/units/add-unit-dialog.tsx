"use client";

import { useState } from "react";
import { Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUnit } from "@/server/actions/units";

export function AddUnitDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        try {
            const result = await createUnit(formData);
            if (result.success) {
                toast.success(result.message);
                setOpen(false);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Erro inesperado ao criar unidade.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> Nova Unidade
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-pm-blue/10 rounded-full">
                            <Shield className="h-5 w-5 text-pm-blue" />
                        </div>
                        <DialogTitle>Nova Unidade</DialogTitle>
                    </div>
                    <DialogDescription>
                        Adicione uma nova unidade organizacional ao sistema.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome da Unidade</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Ex: 10º BPM-I"
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-pm-blue text-white" disabled={loading}>
                            {loading ? "Salvando..." : "Criar Unidade"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

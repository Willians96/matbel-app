"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Crosshair } from "lucide-react";
import { createArma } from "@/server/actions/inventario";
import { toast } from "sonner";

export function AddArmaDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const result = await createArma({
            patrimony: fd.get("patrimony") as string,
            serialNumber: fd.get("serialNumber") as string,
            name: fd.get("name") as string,
            caliber: fd.get("caliber") as string || undefined,
            finish: fd.get("finish") as string || undefined,
            manufacturer: fd.get("manufacturer") as string || undefined,
            observations: fd.get("observations") as string || undefined,
        });
        setLoading(false);
        if (result.success) {
            toast.success("Arma Cadastrada!", { description: result.message });
            setOpen(false);
            router.refresh();
        } else {
            toast.error("Erro", { description: result.message });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Cadastrar Arma
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-pm-blue">
                        <Crosshair className="w-5 h-5" /> Cadastrar Nova Arma
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="patrimony">Patrimônio *</Label>
                            <Input id="patrimony" name="patrimony" required placeholder="Ex: 001234" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="serialNumber">Nº Série *</Label>
                            <Input id="serialNumber" name="serialNumber" required placeholder="Ex: AB123456" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="name">Nome do Material *</Label>
                        <Input id="name" name="name" required placeholder="Ex: Pistola Semiautomática TS9" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="caliber">Calibre</Label>
                            <Input id="caliber" name="caliber" placeholder="Ex: .40 S&W" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="finish">Acabamento</Label>
                            <Input id="finish" name="finish" placeholder="Ex: Oxidada Negra" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="manufacturer">Fabricante</Label>
                        <Input id="manufacturer" name="manufacturer" placeholder="Ex: Taurus" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="observations">Observações</Label>
                        <Input id="observations" name="observations" placeholder="Observações opcionais..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90" disabled={loading}>
                            {loading ? "Salvando..." : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

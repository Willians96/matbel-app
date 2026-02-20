"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Zap } from "lucide-react";
import { createMunicao } from "@/server/actions/inventario";
import { toast } from "sonner";

const TIPOS = ["FMJ", "JHP", "JSP", "Treino", "Letal", "Não-Letal", "Outro"];

export function AddMunicaoDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tipo, setTipo] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const result = await createMunicao({
            batch: fd.get("batch") as string,
            description: fd.get("description") as string,
            type: tipo || (fd.get("typeCustom") as string) || "FMJ",
            qty: parseInt(fd.get("qty") as string),
            expiresAt: fd.get("expiresAt") as string || undefined,
            observations: fd.get("observations") as string || undefined,
        });
        setLoading(false);
        if (result.success) {
            toast.success("Lote Cadastrado!", { description: result.message });
            setOpen(false);
            setTipo("");
            router.refresh();
        } else {
            toast.error("Erro", { description: result.message });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Cadastrar Lote
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-pm-blue">
                        <Zap className="w-5 h-5" /> Cadastrar Lote de Munição
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="m-batch">Nº do Lote *</Label>
                            <Input id="m-batch" name="batch" required placeholder="Ex: LOT-2024-001" className="font-mono" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="m-qty">Quantidade *</Label>
                            <Input id="m-qty" name="qty" type="number" min={1} required placeholder="Ex: 1000" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="m-desc">Descrição *</Label>
                        <Input id="m-desc" name="description" required placeholder="Ex: Cartucho .40 S&W 180gr" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Tipo</Label>
                            <Select value={tipo} onValueChange={setTipo}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="m-expires">Validade</Label>
                            <Input id="m-expires" name="expiresAt" type="date" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="m-obs">Observações</Label>
                        <Input id="m-obs" name="observations" placeholder="Observações opcionais..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90" disabled={loading}>
                            {loading ? "Salvando..." : "Cadastrar Lote"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

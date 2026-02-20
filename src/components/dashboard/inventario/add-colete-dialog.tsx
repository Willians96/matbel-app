"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Shield } from "lucide-react";
import { createColete } from "@/server/actions/inventario";
import { toast } from "sonner";

const SIZES = ["PP", "P", "M", "G", "GG", "XGG", "Único"];

export function AddColeteDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const result = await createColete({
            patrimony: fd.get("patrimony") as string,
            serialNumber: fd.get("serialNumber") as string,
            name: fd.get("name") as string,
            model: fd.get("model") as string || undefined,
            size: size || undefined,
            expiresAt: fd.get("expiresAt") as string || undefined,
            observations: fd.get("observations") as string || undefined,
        });
        setLoading(false);
        if (result.success) {
            toast.success("Colete Cadastrado!", { description: result.message });
            setOpen(false);
            setSize("");
            router.refresh();
        } else {
            toast.error("Erro", { description: result.message });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md">
                    <Plus className="w-4 h-4 mr-2" /> Cadastrar Colete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-pm-blue">
                        <Shield className="w-5 h-5" /> Cadastrar Novo Colete
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="c-patrimony">Patrimônio *</Label>
                            <Input id="c-patrimony" name="patrimony" required placeholder="Ex: 005678" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="c-serial">Nº Série *</Label>
                            <Input id="c-serial" name="serialNumber" required placeholder="Ex: CV789012" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-name">Nome do Material *</Label>
                        <Input id="c-name" name="name" required placeholder="Ex: Colete Balístico Nível III-A" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Tamanho</Label>
                            <Select value={size} onValueChange={setSize}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {SIZES.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="c-model">Modelo</Label>
                            <Input id="c-model" name="model" placeholder="Ex: Modular" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-expires">Validade</Label>
                        <Input id="c-expires" name="expiresAt" type="date" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-obs">Observações</Label>
                        <Input id="c-obs" name="observations" placeholder="Observações opcionais..." />
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

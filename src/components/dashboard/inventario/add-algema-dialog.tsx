"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Link2, Info } from "lucide-react";
import { createAlgema } from "@/server/actions/inventario";
import { toast } from "sonner";

export function AddAlgemaDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasRegistry, setHasRegistry] = useState(true);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const result = await createAlgema({
            patrimony: hasRegistry ? (fd.get("patrimony") as string) || undefined : undefined,
            serialNumber: hasRegistry ? (fd.get("serialNumber") as string) || undefined : undefined,
            name: fd.get("name") as string,
            brand: fd.get("brand") as string || undefined,
            model: fd.get("model") as string || undefined,
            observations: fd.get("observations") as string || undefined,
            qty: hasRegistry ? 1 : parseInt(fd.get("qty") as string) || 1,
        });
        setLoading(false);
        if (result.success) {
            toast.success("Algema Cadastrada!", { description: result.message });
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
                    <Plus className="w-4 h-4 mr-2" /> Cadastrar Algema
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-pm-blue">
                        <Link2 className="w-5 h-5" /> Cadastrar Nova Algema
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {/* Toggle: com ou sem registro */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div>
                            <p className="text-sm font-medium text-slate-800">Possui Patrimônio / Série?</p>
                            <p className="text-xs text-slate-500">
                                {hasRegistry
                                    ? "Item rastreável individualmente."
                                    : "Sem registro — controle por quantidade (pool)."}
                            </p>
                        </div>
                        <Switch checked={hasRegistry} onCheckedChange={setHasRegistry} />
                    </div>

                    {hasRegistry ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="a-patrimony">Patrimônio</Label>
                                <Input id="a-patrimony" name="patrimony" placeholder="Ex: 009900" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="a-serial">Nº Série</Label>
                                <Input id="a-serial" name="serialNumber" placeholder="Ex: ALG001" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Label htmlFor="a-qty">Quantidade a Adicionar ao Estoque</Label>
                            <Input id="a-qty" name="qty" type="number" min={1} defaultValue={1} required />
                            <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                                <Info className="w-3 h-3" />
                                Patrimônio 0008 e Série 0009 serão atribuídos automaticamente.
                            </p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <Label htmlFor="a-name">Nome do Material *</Label>
                        <Input id="a-name" name="name" required placeholder="Ex: Algema Dupla de Aço" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="a-brand">Marca</Label>
                            <Input id="a-brand" name="brand" placeholder="Ex: Clave" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="a-model">Modelo</Label>
                            <Input id="a-model" name="model" placeholder="Ex: Standard" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="a-obs">Observações</Label>
                        <Input id="a-obs" name="observations" placeholder="Observações opcionais..." />
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

"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Eye, Pencil, Trash2, Loader2, AlertTriangle, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import {
    updateArma, updateColete, updateAlgema, updateMunicao,
    deleteArma, deleteColete, deleteAlgema, deleteMunicao,
} from "@/server/actions/inventario";

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "disponivel" | "em_uso" | "manutencao" | "baixado";

type ArmaItem = {
    id: number; patrimony: string; serialNumber: string; name: string;
    caliber: string | null; manufacturer: string | null; finish: string | null;
    observations?: string | null; status: string;
};
type ColeteItem = {
    id: number; patrimony: string; serialNumber: string; name: string;
    model: string | null; size: string | null; expiresAt: Date | null;
    observations?: string | null; status: string;
};
type AlgemaItem = {
    id: number; patrimony: string; serialNumber: string; name: string;
    brand: string | null; model: string | null; hasRegistry: boolean;
    availableQty: number; totalQty: number;
    observations?: string | null; status: string;
};
type MunicaoItem = {
    id: number; batch: string; description: string; type: string;
    availableQty: number; totalQty: number; expiresAt: Date | null;
    observations?: string | null;
};

type ItemType = "arma" | "colete" | "algema" | "municao";

// ─── Status Select ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: Status; label: string }[] = [
    { value: "disponivel", label: "Disponível" },
    { value: "em_uso", label: "Em Uso" },
    { value: "manutencao", label: "Manutenção" },
    { value: "baixado", label: "Baixado" },
];

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pm-blue/30"
        >
            {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="space-y-0.5">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
            <p className="text-sm text-slate-800 font-mono">{value ?? "—"}</p>
        </div>
    );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({
    label, onConfirm,
}: { label: string; onConfirm: () => Promise<void> }) {
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    function handleDelete() {
        startTransition(async () => {
            await onConfirm();
            setOpen(false);
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button title="Excluir" className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Confirmar Exclusão
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-slate-600">
                    Deseja excluir permanentemente <span className="font-semibold text-slate-800">{label}</span>?
                    Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        className="flex-1 bg-red-600 text-white hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={pending}
                    >
                        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Excluir"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// ─── ARMA ─────────────────────────────────────────────────────────────────────

export function ArmaRowActions({ item }: { item: ArmaItem }) {
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [form, setForm] = useState({
        name: item.name, caliber: item.caliber ?? "",
        manufacturer: item.manufacturer ?? "", finish: item.finish ?? "",
        observations: item.observations ?? "", status: item.status,
    });

    function handleEdit() {
        startTransition(async () => {
            const res = await updateArma(item.id, form);
            if (res.success) { toast.success("Arma atualizada!"); setEditOpen(false); }
            else toast.error("Erro ao atualizar.");
        });
    }

    async function handleDelete() {
        const res = await deleteArma(item.id);
        if (res.success) toast.success("Arma excluída!");
        else toast.error(res.message ?? "Erro ao excluir.");
    }

    return (
        <div className="flex items-center gap-0.5">
            {/* View */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogTrigger asChild>
                    <button title="Visualizar" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-pm-blue transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Detalhes da Arma</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <Field label="Patrimônio" value={item.patrimony} />
                        <Field label="Série" value={item.serialNumber} />
                        <Field label="Nome" value={item.name} />
                        <Field label="Calibre" value={item.caliber} />
                        <Field label="Fabricante" value={item.manufacturer} />
                        <Field label="Acabamento" value={item.finish} />
                        <Field label="Status" value={item.status} />
                        <Field label="Observações" value={item.observations} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                    <button title="Editar" className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-pm-blue transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Editar Arma — {item.patrimony}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                            <div><Label>Calibre</Label><Input value={form.caliber} onChange={e => setForm(f => ({ ...f, caliber: e.target.value }))} /></div>
                            <div><Label>Fabricante</Label><Input value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} /></div>
                            <div><Label>Acabamento</Label><Input value={form.finish} onChange={e => setForm(f => ({ ...f, finish: e.target.value }))} /></div>
                        </div>
                        <div><Label>Status</Label><StatusSelect value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} /></div>
                        <div><Label>Observações</Label><Input value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} /></div>
                        <Button className="w-full bg-pm-blue text-white hover:bg-pm-blue/90" onClick={handleEdit} disabled={pending}>
                            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" />Salvar Alterações</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete */}
            <DeleteConfirm label={`${item.name} (${item.patrimony})`} onConfirm={handleDelete} />
        </div>
    );
}

// ─── COLETE ───────────────────────────────────────────────────────────────────

export function ColeteRowActions({ item }: { item: ColeteItem }) {
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [form, setForm] = useState({
        name: item.name, model: item.model ?? "", size: item.size ?? "",
        expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split("T")[0] : "",
        observations: item.observations ?? "", status: item.status,
    });

    function handleEdit() {
        startTransition(async () => {
            const res = await updateColete(item.id, form);
            if (res.success) { toast.success("Colete atualizado!"); setEditOpen(false); }
            else toast.error("Erro ao atualizar.");
        });
    }

    async function handleDelete() {
        const res = await deleteColete(item.id);
        if (res.success) toast.success("Colete excluído!");
        else toast.error(res.message ?? "Erro ao excluir.");
    }

    return (
        <div className="flex items-center gap-0.5">
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogTrigger asChild>
                    <button title="Visualizar" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-pm-blue transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Detalhes do Colete</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <Field label="Patrimônio" value={item.patrimony} />
                        <Field label="Série" value={item.serialNumber} />
                        <Field label="Nome" value={item.name} />
                        <Field label="Modelo" value={item.model} />
                        <Field label="Tamanho" value={item.size} />
                        <Field label="Validade" value={item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("pt-BR") : undefined} />
                        <Field label="Status" value={item.status} />
                        <Field label="Observações" value={item.observations} />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                    <button title="Editar" className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-pm-blue transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Editar Colete — {item.patrimony}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                            <div><Label>Modelo</Label><Input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} /></div>
                            <div><Label>Tamanho</Label><Input value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} /></div>
                            <div><Label>Validade</Label><Input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} /></div>
                        </div>
                        <div><Label>Status</Label><StatusSelect value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} /></div>
                        <div><Label>Observações</Label><Input value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} /></div>
                        <Button className="w-full bg-pm-blue text-white hover:bg-pm-blue/90" onClick={handleEdit} disabled={pending}>
                            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" />Salvar Alterações</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <DeleteConfirm label={`${item.name} (${item.patrimony})`} onConfirm={handleDelete} />
        </div>
    );
}

// ─── ALGEMA ───────────────────────────────────────────────────────────────────

export function AlgemaRowActions({ item }: { item: AlgemaItem }) {
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [form, setForm] = useState({
        name: item.name, brand: item.brand ?? "", model: item.model ?? "",
        observations: item.observations ?? "", status: item.status,
    });

    function handleEdit() {
        startTransition(async () => {
            const res = await updateAlgema(item.id, form);
            if (res.success) { toast.success("Algema atualizada!"); setEditOpen(false); }
            else toast.error("Erro ao atualizar.");
        });
    }

    async function handleDelete() {
        const res = await deleteAlgema(item.id);
        if (res.success) toast.success("Algema excluída!");
        else toast.error("Erro ao excluir.");
    }

    return (
        <div className="flex items-center gap-0.5">
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogTrigger asChild>
                    <button title="Visualizar" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-pm-blue transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Detalhes da Algema</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <Field label="Tipo" value={item.hasRegistry ? "Rastreável" : "Pool"} />
                        <Field label="Patrimônio" value={item.hasRegistry ? item.patrimony : "Sem registro"} />
                        <Field label="Série" value={item.hasRegistry ? item.serialNumber : "Sem registro"} />
                        <Field label="Nome" value={item.name} />
                        <Field label="Marca" value={item.brand} />
                        <Field label="Modelo" value={item.model} />
                        <Field label="Qtd Disponível" value={`${item.availableQty} / ${item.totalQty}`} />
                        <Field label="Status" value={item.status} />
                        <Field label="Observações" value={item.observations} />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                    <button title="Editar" className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-pm-blue transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Editar Algema — {item.name}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                            <div><Label>Marca</Label><Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} /></div>
                            <div><Label>Modelo</Label><Input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} /></div>
                        </div>
                        <div><Label>Status</Label><StatusSelect value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} /></div>
                        <div><Label>Observações</Label><Input value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} /></div>
                        <Button className="w-full bg-pm-blue text-white hover:bg-pm-blue/90" onClick={handleEdit} disabled={pending}>
                            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" />Salvar Alterações</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <DeleteConfirm label={item.name} onConfirm={handleDelete} />
        </div>
    );
}

// ─── MUNIÇÃO ──────────────────────────────────────────────────────────────────

export function MunicaoRowActions({ item }: { item: MunicaoItem }) {
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [form, setForm] = useState({
        description: item.description, type: item.type,
        expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().split("T")[0] : "",
        observations: item.observations ?? "",
    });

    function handleEdit() {
        startTransition(async () => {
            const res = await updateMunicao(item.id, form);
            if (res.success) { toast.success("Munição atualizada!"); setEditOpen(false); }
            else toast.error("Erro ao atualizar.");
        });
    }

    async function handleDelete() {
        const res = await deleteMunicao(item.id);
        if (res.success) toast.success("Lote excluído!");
        else toast.error("Erro ao excluir.");
    }

    return (
        <div className="flex items-center gap-0.5">
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogTrigger asChild>
                    <button title="Visualizar" className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-pm-blue transition-colors">
                        <Eye className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Detalhes do Lote de Munição</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-2">
                        <Field label="Lote" value={item.batch} />
                        <Field label="Tipo" value={item.type} />
                        <Field label="Descrição" value={item.description} />
                        <Field label="Validade" value={item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("pt-BR") : undefined} />
                        <Field label="Qtd Disponível" value={item.availableQty} />
                        <Field label="Qtd Total" value={item.totalQty} />
                        <Field label="Observações" value={item.observations} />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                    <button title="Editar" className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-pm-blue transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Editar Lote — {item.batch}</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div><Label>Descrição</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                            <div><Label>Tipo</Label><Input value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} /></div>
                            <div><Label>Validade</Label><Input type="date" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} /></div>
                        </div>
                        <div><Label>Observações</Label><Input value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} /></div>
                        <Button className="w-full bg-pm-blue text-white hover:bg-pm-blue/90" onClick={handleEdit} disabled={pending}>
                            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-2" />Salvar Alterações</>}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <DeleteConfirm label={`Lote ${item.batch}`} onConfirm={handleDelete} />
        </div>
    );
}

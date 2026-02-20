"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Upload, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle,
    AlertTriangle, Download, X, ChevronDown, ChevronUp
} from "lucide-react";
import { importArmas, importColetes, importAlgemas, importMunicoes, downloadTemplate } from "@/server/actions/bulk-import";

type ItemType = "armas" | "coletes" | "algemas" | "municoes";

const TYPE_CONFIG: Record<ItemType, {
    label: string;
    required: string[];
    optional: string[];
    color: string;
}> = {
    armas: {
        label: "Armas",
        required: ["PATRIMONIO", "SERIE", "NOME"],
        optional: ["CALIBRE", "FABRICANTE", "ACABAMENTO"],
        color: "text-red-600",
    },
    coletes: {
        label: "Coletes",
        required: ["PATRIMONIO", "SERIE", "NOME"],
        optional: ["MODELO", "TAMANHO", "VALIDADE"],
        color: "text-blue-600",
    },
    algemas: {
        label: "Algemas",
        required: ["NOME"],
        optional: ["PATRIMONIO", "SERIE", "MARCA", "MODELO", "QUANTIDADE"],
        color: "text-orange-600",
    },
    municoes: {
        label: "Munições",
        required: ["LOTE", "DESCRICAO", "TIPO", "QUANTIDADE"],
        optional: ["VALIDADE"],
        color: "text-yellow-600",
    },
};

const IMPORT_ACTIONS: Record<ItemType, (fd: FormData) => Promise<unknown>> = {
    armas: importArmas,
    coletes: importColetes,
    algemas: importAlgemas,
    municoes: importMunicoes,
};

interface ImportReport {
    inserted: number;
    skipped: number;
    errors: string[];
}

interface Props {
    type: ItemType;
}

export function InventarioImportDialog({ type }: Props) {
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [report, setReport] = useState<ImportReport | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [showErrors, setShowErrors] = useState(false);
    const [downloadingTemplate, setDownloadingTemplate] = useState(false);
    const router = useRouter();

    const cfg = TYPE_CONFIG[type];

    const onDrop = useCallback(async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        setUploading(true);
        setReport(null);
        setGlobalError(null);

        const fd = new FormData();
        fd.append("file", file);

        const result = await IMPORT_ACTIONS[type](fd) as
            { success: true; inserted: number; skipped: number; errors: string[] } |
            { success: false; error: string };

        setUploading(false);

        if (!result.success) {
            setGlobalError(result.error);
        } else {
            setReport({ inserted: result.inserted, skipped: result.skipped, errors: result.errors });
            if (result.inserted > 0) router.refresh();
        }
    }, [type, router]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    async function handleDownloadTemplate() {
        setDownloadingTemplate(true);
        const base64 = await downloadTemplate(type);
        const blob = new Blob([Buffer.from(base64, "base64")], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `template_${type}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloadingTemplate(false);
    }

    function handleClose() {
        setOpen(false);
        setReport(null);
        setGlobalError(null);
        setShowErrors(false);
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-slate-200 hover:border-pm-blue/50 hover:text-pm-blue text-slate-600">
                    <Upload className="w-4 h-4" />
                    Importar XLSX
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-800">
                        <FileSpreadsheet className="w-5 h-5 text-pm-blue" />
                        Importar {cfg.label} via Planilha
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Column Info */}
                    <div className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                        <p className="font-semibold text-slate-700">Colunas esperadas:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {cfg.required.map(c => (
                                <span key={c} className="px-2 py-0.5 bg-pm-blue text-white rounded-md font-mono text-[11px]">
                                    {c}*
                                </span>
                            ))}
                            {cfg.optional.map(c => (
                                <span key={c} className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md font-mono text-[11px]">
                                    {c}
                                </span>
                            ))}
                        </div>
                        <p className="text-slate-500"><span className="text-pm-blue font-bold">Azul*</span> = obrigatório &nbsp;|&nbsp; Cinza = opcional</p>
                    </div>

                    {/* Download Template */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadTemplate}
                        disabled={downloadingTemplate}
                        className="w-full gap-2 border-dashed border-pm-blue/40 text-pm-blue hover:bg-pm-blue/5"
                    >
                        {downloadingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Baixar Template .xlsx
                    </Button>

                    {/* Dropzone */}
                    {!report && !globalError && (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                                ${isDragActive ? "border-pm-blue bg-pm-blue/5" : "border-slate-200 hover:border-pm-blue/50 hover:bg-slate-50"}
                                ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                        >
                            <input {...getInputProps()} />
                            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 mb-3">
                                {uploading ? <Loader2 className="w-7 h-7 text-pm-blue animate-spin" /> : <FileSpreadsheet className="w-7 h-7 text-pm-blue" />}
                            </div>
                            <p className="font-semibold text-slate-700 text-sm">
                                {uploading ? "Processando planilha..." : "Clique ou arraste o arquivo aqui"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">Suporta .xlsx e .xls</p>
                        </div>
                    )}

                    {/* Global Error */}
                    {globalError && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{globalError}</p>
                            <button onClick={() => setGlobalError(null)} className="ml-auto">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Import Report */}
                    {report && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-green-700">{report.inserted}</p>
                                    <p className="text-xs text-green-600">Inseridos</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-amber-700">{report.skipped}</p>
                                    <p className="text-xs text-amber-600">Duplicados</p>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                                    <p className="text-2xl font-bold text-red-600">{report.errors.length}</p>
                                    <p className="text-xs text-red-500">Inválidos</p>
                                </div>
                            </div>

                            {report.errors.length > 0 && (
                                <div className="border border-red-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setShowErrors(s => !s)}
                                        className="w-full flex items-center justify-between px-4 py-2.5 bg-red-50 text-red-700 text-sm font-medium"
                                    >
                                        <span>Ver linhas inválidas ({report.errors.length})</span>
                                        {showErrors ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    {showErrors && (
                                        <ul className="max-h-32 overflow-y-auto px-4 py-2 space-y-1">
                                            {report.errors.map((e, i) => (
                                                <li key={i} className="text-xs text-red-600 font-mono">{e}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => setReport(null)}>
                                    Importar outro arquivo
                                </Button>
                                <Button className="flex-1 bg-pm-blue text-white hover:bg-pm-blue/90" onClick={handleClose}>
                                    Concluir
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

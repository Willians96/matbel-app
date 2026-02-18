
"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { UploadCloud, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { processBulkImport } from "@/server/actions/bulk-import";
import { Button } from "@/components/ui/button";

export function BulkImport() {
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);
        setMessage(null);

            try {
            const formData = new FormData();
            formData.append("file", file);

            const result = await processBulkImport(formData);

            if (result.success) {
                setMessage({ type: 'success', text: `${result.count} registros importados com sucesso!` });
            } else {
                const err = (result as any).error;
                setMessage({ type: 'error', text: err || "Erro desconhecido." });
            }
        } catch (error) {
            setMessage({ type: 'error', text: "Erro ao processar arquivo." });
        } finally {
            setIsUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        disabled: isUploading
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-8 
                    flex flex-col items-center justify-center text-center 
                    transition-all duration-200 cursor-pointer
                    ${isDragActive ? "border-pm-blue bg-blue-50/50" : "border-slate-200 hover:border-pm-blue/50 hover:bg-slate-50"}
                    ${isUploading ? "opacity-50 pointer-events-none" : ""}
                `}
            >
                <input {...getInputProps()} />

                <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
                    {isUploading ? (
                        <Loader2 className="w-8 h-8 text-pm-blue animate-spin" />
                    ) : (
                        <FileSpreadsheet className="w-8 h-8 text-pm-blue" />
                    )}
                </div>

                <div className="space-y-1">
                    <p className="font-medium text-slate-700">
                        {isUploading ? "Processando..." : "Clique ou arraste sua planilha aqui"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Suporta arquivos .xlsx e .xls
                    </p>
                </div>

                <div className="mt-4 text-xs text-muted-foreground bg-slate-50 px-3 py-2 rounded border border-slate-100">
                    <span className="font-semibold">Colunas Obrigatórias:</span> serial, name, category, unit
                </div>
            </div>

            {message && (
                <div className={`mt-4 p-4 rounded-md flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2
                    ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}
                `}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                    {message.text}
                </div>
            )}
        </div>
    );
}

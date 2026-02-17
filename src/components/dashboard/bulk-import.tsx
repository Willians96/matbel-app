"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { processBulkImport } from "@/server/actions/import";

export function BulkImport() {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append("file", file);

        const result = await processBulkImport(formData);

        if (result.success) {
            setStatus({ type: 'success', message: `${result.count} equipamentos importados com sucesso!` });
            setFile(null);
        } else {
            setStatus({ type: 'error', message: result.error || "Erro na importação." });
        }

        setIsUploading(false);
    };

    return (
        <div className="p-6 border-2 border-dashed rounded-lg bg-slate-50 flex flex-col items-center gap-4 text-center">
            <div className="p-4 bg-white rounded-full shadow-sm">
                <FileSpreadsheet className="w-8 h-8 text-pm-blue" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900">Importação em Massa</h3>
                <p className="text-sm text-gray-500">
                    Carregue uma planilha Excel (.xlsx) com os equipamentos.<br />
                    Colunas necessárias: Serial, Nome, Categoria, Unidade.
                </p>
            </div>

            <div className="w-full max-w-xs">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-pm-blue file:text-white
              hover:file:bg-pm-blue/90"
                />
            </div>

            {file && (
                <Button onClick={handleUpload} disabled={isUploading} className="w-full max-w-xs">
                    {isUploading ? "Processando..." : `Importar ${file.name}`}
                </Button>
            )}

            {status && (
                <div className={`flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {status.message}
                </div>
            )}
        </div>
    );
}

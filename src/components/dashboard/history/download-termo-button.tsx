"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { TransferHistoryItem } from "@/server/queries/history";

interface DownloadTermoButtonProps {
    item: TransferHistoryItem;
}

export function DownloadTermoButton({ item }: DownloadTermoButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            const { gerarTermoCarga } = await import("@/lib/pdf/termo-carga");
            await gerarTermoCarga(item);
            toast.success("Termo gerado com sucesso!", { description: "O PDF foi baixado automaticamente." });
        } catch (err) {
            console.error(err);
            toast.error("Erro ao gerar PDF", { description: "Tente novamente." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={loading}
            className="text-pm-blue hover:bg-pm-blue/10 hover:text-pm-blue h-7 px-2 gap-1"
            title="Baixar Termo"
        >
            {loading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <FileDown className="w-3.5 h-3.5" />
            }
            <span className="hidden sm:inline text-xs">Termo</span>
        </Button>
    );
}

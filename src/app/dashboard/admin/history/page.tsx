import { getTransferHistory } from "@/server/queries/history";
import { HistoryTableClient } from "@/components/dashboard/history/history-table-client";
import { HistoryFilters } from "@/components/dashboard/history/history-filters";
import { History } from "lucide-react";

export default async function HistoryPage({
    searchParams,
}: {
    searchParams: {
        userRe?: string;
        serialNumber?: string;
        type?: "allocation" | "return" | "all";
        startDate?: string;
        endDate?: string;
    };
}) {
    const filters = {
        userRe: searchParams.userRe,
        serialNumber: searchParams.serialNumber,
        type: searchParams.type,
        startDate: searchParams.startDate ? new Date(searchParams.startDate) : undefined,
        endDate: searchParams.endDate ? new Date(searchParams.endDate) : undefined,
    };

    const historyResult = await getTransferHistory(filters);
    const data = historyResult.success && historyResult.data ? historyResult.data : [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pm-blue text-white rounded-full shadow-lg shadow-blue-900/20">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Histórico Geral</h2>
                        <p className="text-muted-foreground text-sm font-medium">
                            Registro completo de todas as movimentações de material.
                        </p>
                    </div>
                </div>
            </div>

            <HistoryFilters />
            <HistoryTableClient data={data} />
        </div>
    );
}

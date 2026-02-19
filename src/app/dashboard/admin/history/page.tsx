
import { getTransferHistory } from "@/server/queries/history";
import { HistoryTable } from "@/components/dashboard/history-table";
import { History } from "lucide-react";

export default async function HistoryPage() {
    const historyResult = await getTransferHistory();
    const data = historyResult.success && historyResult.data ? historyResult.data : [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-pm-blue text-white rounded-full">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Histórico Geral</h2>
                        <p className="text-muted-foreground">
                            Registro completo de todas as movimentações de material.
                        </p>
                    </div>
                </div>
            </div>

            <HistoryTable data={data} />
        </div>
    );
}

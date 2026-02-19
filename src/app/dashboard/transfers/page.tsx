
import { getPendingTransfers } from "@/server/queries/transfers";
import { TransferCard } from "@/components/dashboard/transfer-card";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle2, Clock } from "lucide-react";

export default async function TransfersPage() {
    const { userId } = await auth();
    if (!userId) return null;

    const pendingTransfers = await getPendingTransfers(userId, "user");

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recebimentos Pendentes</h2>
                <p className="text-muted-foreground">
                    Confirme o recebimento de materiais enviados pela administração.
                </p>
            </div>

            {pendingTransfers.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
                    <h3 className="text-lg font-medium text-slate-900">Tudo em dia!</h3>
                    <p>Você não possui pendências de recebimento.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingTransfers.map((transfer) => (
                        <TransferCard key={transfer.id} transfer={transfer} />
                    ))}
                </div>
            )}
        </div>
    );
}

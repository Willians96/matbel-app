
import { getPendingTransfers } from "@/server/queries/transfers";
import { TransferCard } from "@/components/dashboard/transfer-card";
import { auth } from "@clerk/nextjs/server";
import { getUserRole } from "@/server/auth";
import { CheckCircle2, ArrowRightLeft } from "lucide-react";

export default async function TransfersPage() {
    const { userId } = await auth();
    if (!userId) return null;

    const role = await getUserRole() || "user";
    const pendingTransfers = await getPendingTransfers(userId, role);

    const isReturns = role === 'admin';

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-full text-slate-700">
                    <ArrowRightLeft className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {isReturns ? "Devoluções Pendentes" : "Recebimentos Pendentes"}
                    </h2>
                    <p className="text-muted-foreground">
                        {isReturns
                            ? "Confirme o recebimento de materiais devolvidos por policiais."
                            : "Confirme o recebimento de materiais enviados pela administração."
                        }
                    </p>
                </div>
            </div>

            {pendingTransfers.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500 opacity-50" />
                    <h3 className="text-lg font-medium text-slate-900">Tudo em dia!</h3>
                    <p>
                        {isReturns
                            ? "Nenhuma devolução pendente."
                            : "Você não possui pendências de recebimento."
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {pendingTransfers.map((transfer) => (
                        <TransferCard key={transfer.id} transfer={transfer as any} />
                    ))}
                </div>
            )
            }
        </div >
    );
}

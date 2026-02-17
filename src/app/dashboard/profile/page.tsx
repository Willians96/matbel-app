
import { getCurrentUserProfile } from "@/server/queries/user";
import { getUserActiveTransactions } from "@/server/queries/transactions";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { UserCog, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
    const user = await getCurrentUserProfile();
    const transactionsResult = user?.re ? await getUserActiveTransactions(user.re) : { success: false, data: [] };
    const transactions = transactionsResult.success && transactionsResult.data ? transactionsResult.data : [];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full">
                    <UserCog className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Meus Dados</h2>
                    <p className="text-muted-foreground">
                        Mantenha seu cadastro atualizado.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Profile Form */}
                <div className="space-y-6">
                    <ProfileForm initialData={user} />
                </div>

                {/* Right Column: Active Checkouts */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-pm-blue" />
                                <CardTitle>Minhas Cautelas</CardTitle>
                            </div>
                            <CardDescription>Materiais sob sua responsabilidade.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Nenhum material cautelado.</p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {transactions.map((t) => (
                                        <li key={t.id} className="flex flex-col p-4 border rounded-lg bg-slate-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-lg">{t.equipmentName}</span>
                                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                                    Em Uso
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p><span className="font-medium">Serial:</span> {t.serialNumber}</p>
                                                <p><span className="font-medium">Retirada:</span> {t.checkoutDate ? new Date(t.checkoutDate).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                                <p className="text-xs text-gray-400 mt-2">ID: {t.id}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

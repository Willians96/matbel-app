
import { getCurrentUserProfile } from "@/server/queries/user";
import { getCargaPendenteOuAtiva } from "@/server/queries/carga";
import { getUserActiveTransactions } from "@/server/queries/transactions";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { CargaPendenteCard } from "@/components/dashboard/carga-pendente-card";
import { InstructorTrainingCard } from "@/components/dashboard/treinamento/instructor-training-card";
import { getActiveTreinamentoByInstrutor } from "@/server/actions/treinamento";
import { UserCog, Package, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui";
import { getAllUnits } from "@/server/queries/units";

export default async function ProfilePage() {
    const user = await getCurrentUserProfile();
    const transactionsResult = user?.re ? await getUserActiveTransactions(user.re) : { success: false, data: [] };
    const transactions = transactionsResult.success && transactionsResult.data ? transactionsResult.data : [];
    const units = await getAllUnits();
    const carga = user?.id ? await getCargaPendenteOuAtiva(user.id) : null;
    const treinamento = user?.id ? await getActiveTreinamentoByInstrutor(user.id) : null;

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

            {/* Carga Pendente Banner */}
            {carga && (
                <CargaPendenteCard carga={carga} />
            )}

            {/* Treinamento Banner */}
            {treinamento && (
                <InstructorTrainingCard treinamento={treinamento} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Profile Form */}
                <div className="space-y-6">
                    <ProfileForm initialData={user} units={units.map(u => u.name)} />
                </div>

                {/* Right Column: Active Checkouts */}
                <div className="space-y-6">
                    {!carga && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-pm-blue" />
                                    <CardTitle>Minha Carga Ativa</CardTitle>
                                </div>
                                <CardDescription>Materiais sob sua responsabilidade.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {transactions.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Nenhum material em carga ativa.</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {transactions.map((t) => (
                                            <li key={t.id} className="flex flex-col p-4 border rounded-lg bg-slate-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-lg">{t.equipmentName}</span>
                                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
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
                    )}

                    <Card className="border-pm-blue/20 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle className="text-pm-blue">Carga Pessoal (Permanente)</CardTitle>
                            <CardDescription>
                                Possui armamento ou colete fixo?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/dashboard/my-equipment/declare">
                                <Button className="w-full bg-pm-blue text-white hover:bg-pm-blue/90">
                                    Fazer Declaração de Material
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Fallback Sign Out for trapped users */}
            <div className="flex justify-center pt-8 border-t">
                <SignOutButton>
                    <Button variant="destructive" className="gap-2">
                        <LogOut className="w-4 h-4" />
                        Sair do Sistema (Trocar Conta)
                    </Button>
                </SignOutButton>
            </div>
        </div>
    );
}

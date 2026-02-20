
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, ShieldAlert, Wrench, UserPen } from "lucide-react";

import { checkAdmin } from "@/server/auth";
import { getAllUnits } from "@/server/queries/units";
import { AdminManager } from "@/components/dashboard/settings/admin-manager";
import { UserEditor } from "@/components/dashboard/settings/user-editor";

export default async function SettingsPage() {
    await checkAdmin();
    const units = await getAllUnits();
    const unitNames = units.map((u) => u.name);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full shadow-lg shadow-blue-900/20">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Configurações do Sistema</h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        Ajustes globais e preferências da aplicação.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* User Editor Card */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-slate-800">
                            <UserPen className="w-5 h-5 text-pm-blue" />
                            Editar Dados de Usuário
                        </CardTitle>
                        <CardDescription>
                            Busque por RE e edite os dados cadastrais de qualquer policial.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <UserEditor units={unitNames} />
                    </CardContent>
                </Card>

                <AdminManager />

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-yellow-600" />
                                Modo de Manutenção
                            </CardTitle>
                            <CardDescription>
                                Impede o acesso de usuários comuns ao sistema.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                <div>
                                    <p className="font-medium">Status do Sistema</p>
                                    <p className="text-sm text-green-600">Operacional</p>
                                </div>
                                {/* Toggle would go here - placeholder for now */}
                                <div className="h-6 w-12 bg-slate-200 rounded-full cursor-not-allowed opacity-50 relative">
                                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                Funcionalidade em desenvolvimento.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-slate-600" />
                                Preferências de Unidades
                            </CardTitle>
                            <CardDescription>
                                Configurações padrão para novas cautelas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Defina qual unidade é exibida como padrão nos formulários.
                            </p>
                            <div className="p-4 border border-dashed rounded-lg text-center text-sm text-slate-500">
                                Em breve
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

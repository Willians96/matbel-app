
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, ShieldAlert, Wrench } from "lucide-react";

import { checkAdmin } from "@/server/auth";

import { getAllUsers } from "@/server/queries/users";
import { UserList } from "@/components/dashboard/user-list";

export default async function SettingsPage() {
    await checkAdmin();
    const users = await getAllUsers(); // Fetch users

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Configurações do Sistema</h2>
                    <p className="text-muted-foreground">
                        Ajustes globais e preferências da aplicação.
                    </p>
                </div>
            </div>

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

            {/* User Management Section */}
            <UserList users={users as any} />
        </div>
    );
}

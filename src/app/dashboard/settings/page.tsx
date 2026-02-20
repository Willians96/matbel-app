
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, ShieldAlert, Building2 } from "lucide-react";

import { checkAdmin } from "@/server/auth";
import { getAllUnits } from "@/server/queries/units";
import { AdminManager } from "@/components/dashboard/settings/admin-manager";
import { UserEditor } from "@/components/dashboard/settings/user-editor";
import { AddUnitDialog } from "@/components/dashboard/units/add-unit-dialog";
import { UnitsTableClient } from "@/components/dashboard/units/units-table-client";

export default async function SettingsPage() {
    await checkAdmin();
    const units = await getAllUnits();
    const unitNames = units.map((u) => u.name);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
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
                {/* User Editor */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
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

                {/* Admin Manager */}
                <AdminManager />

                {/* ── Unidades ───────────────────────────────────────── */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-pm-blue" />
                                <div>
                                    <CardTitle className="text-slate-800 text-base">
                                        Unidades (OPMs)
                                    </CardTitle>
                                    <CardDescription className="mt-0.5">
                                        {units.length} unidade{units.length !== 1 ? "s" : ""} cadastrada{units.length !== 1 ? "s" : ""} no sistema.
                                    </CardDescription>
                                </div>
                            </div>
                            <AddUnitDialog />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <UnitsTableClient initialUnits={units} />
                    </CardContent>
                </Card>

                {/* Modo de Manutenção */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="flex items-center gap-2 text-slate-800 text-base">
                            <ShieldAlert className="w-5 h-5 text-yellow-600" />
                            Modo de Manutenção
                        </CardTitle>
                        <CardDescription>
                            Impede o acesso de usuários comuns ao sistema temporariamente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                            <div>
                                <p className="font-medium text-sm">Status do Sistema</p>
                                <p className="text-sm text-green-600">Operacional</p>
                            </div>
                            <div className="h-6 w-12 bg-slate-200 rounded-full cursor-not-allowed opacity-50 relative">
                                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">Funcionalidade em desenvolvimento.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

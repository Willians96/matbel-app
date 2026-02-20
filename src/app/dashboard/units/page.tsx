import { getAllUnits } from "@/server/queries/units";
import { checkAdmin } from "@/server/auth";
import { Shield, Building2, BarChart3 } from "lucide-react";
import { AddUnitDialog } from "@/components/dashboard/units/add-unit-dialog";
import { UnitsTableClient } from "@/components/dashboard/units/units-table-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UnitsPage() {
    await checkAdmin();
    const units = await getAllUnits();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white shadow-sm border rounded-xl">
                        <Shield className="w-8 h-8 text-pm-blue" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Unidades</h2>
                        <p className="text-muted-foreground font-medium">
                            Gerenciamento de OPMs e Postos
                        </p>
                    </div>
                </div>
                <AddUnitDialog />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm border-l-4 border-l-pm-blue">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Unidades
                        </CardTitle>
                        <Building2 className="h-4 w-4 text-pm-blue" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{units.length}</div>
                        <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-l-4 border-l-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Ativas
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {units.filter(u => u.active).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Em operação normal</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <UnitsTableClient initialUnits={units} />
        </div>
    );
}

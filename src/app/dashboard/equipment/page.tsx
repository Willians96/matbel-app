
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { getEquipments } from "@/server/queries/equipment";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import ActionMenu from "@/components/ui/action-menu";
import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EquipmentFilters } from "@/components/dashboard/equipment-filters";
import { BulkImport } from "@/components/dashboard/bulk-import";
import { checkAdmin } from "@/server/auth";

export default async function EquipmentPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
    await checkAdmin();
    const params = await searchParams;
    const filters = {
        serialNumber: params?.serialNumber,
        patrimony: params?.patrimony,
        unit: params?.unit,
        status: params?.status,
    };

    const pageNum = Number(params?.page || 1);
    const pageSize = Number(params?.pageSize || 10);
    const result = await getEquipments(filters);
    const equipments = result.success ? result.data : [];
    const total = result.success && typeof result.total === "number" ? result.total : (equipments ? equipments.length : 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Equipamentos</h2>
                    <p className="text-muted-foreground">
                        Gerencie o inventário de material bélico.
                    </p>
                </div>
                <Link href="/dashboard/equipment/new">
                    <Button className="gap-2 bg-pm-blue text-white hover:bg-pm-blue/90">
                        <Plus className="h-4 w-4" /> Novo Equipamento
                    </Button>
                </Link>
                <Link href="/dashboard/equipment/allocate">
                    <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700">
                        <Package className="h-4 w-4" /> Entregar Material
                    </Button>
                </Link>
            </div>

            <Card className="border-slate-100 shadow-sm">
                <CardHeader className="pb-4 border-b border-slate-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="w-5 h-5 text-pm-blue" />
                        Inventário
                    </CardTitle>
                    <CardDescription>
                        Utilize os filtros para localizar materiais específicos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <EquipmentFilters />

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-sm font-medium text-slate-700 mb-2">Ações em Massa</p>
                        <BulkImport />
                    </div>

                    <div className="rounded-md border border-slate-100">
                        <EquipmentTableClient items={equipments} initialPage={pageNum} pageSize={pageSize} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


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
        userRe: params?.userRe,
    };

    const result = await getEquipments(filters);
    const equipments = result.success ? result.data : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-pm-blue">Equipamentos</h2>
                    <p className="text-muted-foreground text-sm">
                        Gerencie o inventário de material bélico.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/dashboard/equipment/new">
                        <Button className="gap-2 bg-pm-blue text-white hover:bg-pm-blue/90 shadow-md">
                            <Plus className="h-4 w-4" /> Novo Equipamento
                        </Button>
                    </Link>
                    <Link href="/dashboard/equipment/allocate">
                        <Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                            <Package className="h-4 w-4" /> Entregar Material
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border-slate-100 shadow-md">
                <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                        <Package className="w-5 h-5 text-pm-blue" />
                        Inventário
                    </CardTitle>
                    <CardDescription>
                        Utilize os filtros para localizar materiais específicos.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <EquipmentFilters />

                    <div className="flex justify-end">
                        <div className="flex gap-2">
                            <BulkImport />
                        </div>
                    </div>

                    <div className="rounded-md border border-slate-200 overflow-x-auto shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-slate-700">Serial</TableHead>
                                    <TableHead className="font-semibold text-slate-700 hidden sm:table-cell">Patrimônio</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Nome</TableHead>
                                    <TableHead className="font-semibold text-slate-700 hidden md:table-cell">Unidade</TableHead>
                                    <TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Responsável</TableHead>
                                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {equipments?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Package className="h-8 w-8 opacity-20" />
                                                <p>Nenhum equipamento encontrado.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    equipments?.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-mono font-medium text-slate-700">{item.serialNumber}</TableCell>
                                            <TableCell className="text-slate-600 text-sm hidden sm:table-cell">{item.patrimony || "-"}</TableCell>
                                            <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                                            <TableCell className="text-slate-600 text-sm hidden md:table-cell">{item.unit}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {item.status === 'em_uso' && item.user ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-slate-900">{item.user.name}</span>
                                                        <span className="text-xs text-muted-foreground">RE: {item.user.re}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border
                                                    ${item.status === 'disponivel' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        item.status === 'em_uso' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            item.status === 'manutencao' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-gray-100 text-gray-700 border-gray-200'
                                                    }
                                                `}>
                                                    {item.status === 'disponivel' ? 'Disponível' :
                                                        item.status === 'em_uso' ? 'Em Uso' :
                                                            item.status === 'manutencao' ? 'Manutenção' : 'Baixado'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

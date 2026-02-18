
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
    };

    const result = await getEquipments(filters);
    const equipments = result.success ? result.data : [];

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
                        <Table>
                            <TableHeader className="bg-slate-50">
                                    <TableRow>
                                    <TableHead>Serial</TableHead>
                                    <TableHead>Patrimônio</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Unidade</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {equipments?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            Nenhum equipamento encontrado com os filtros atuais.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    equipments?.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-mono font-medium text-slate-700">{item.serialNumber}</TableCell>
                                            <TableCell className="text-slate-600">{item.patrimony || "-"}</TableCell>
                                            <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.unit}</TableCell>
                                            <TableCell>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border
                                                    ${item.status === 'disponivel' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        item.status === 'em_uso' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            item.status === 'manutencao' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                'bg-gray-100 text-gray-700 border-gray-200'
                                                    }
                                                `}>
                                                    {item.status === 'disponivel' ? 'Disponível' :
                                                        item.status === 'em_uso' ? 'Em Uso' :
                                                            item.status === 'manutencao' ? 'Manutenção' : 'Baixado'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border
                                                    ${item.status === 'disponivel' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        item.status === 'em_uso' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
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


import Link from "next/link";
import { Plus } from "lucide-react";
import { getEquipments } from "@/server/queries/equipment";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default async function EquipmentPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
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
                    <h2 className="text-3xl font-bold tracking-tight">Equipamentos</h2>
                    <p className="text-muted-foreground">
                        Gerencie o inventário de material bélico.
                    </p>
                </div>
                <Link href="/dashboard/equipment/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Novo Equipamento
                    </Button>
                </Link>
            </div>

            <EquipmentFilters />

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
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
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Nenhum equipamento encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            equipments?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.serialNumber}</TableCell>
                                    <TableCell>{item.patrimony || "-"}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${item.status === 'disponivel' ? 'bg-green-100 text-green-800' :
                                                item.status === 'em_uso' ? 'bg-blue-100 text-blue-800' :
                                                    item.status === 'manutencao' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
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
        </div>
    );
}

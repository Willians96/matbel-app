
import { getAllUnits } from "@/server/queries/units";
import { createUnit, deleteUnit } from "@/server/actions/units";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ActionMenu from "@/components/ui/action-menu2";
import { Shield, Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

import { checkAdmin } from "@/server/auth";

export default async function UnitsPage() {
    await checkAdmin();
    const units = await getAllUnits();

    async function addUnit(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        await createUnit(name);
    }

    async function removeUnit(id: number) {
        "use server";
        await deleteUnit(id);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Gerenciar Unidades</h2>
                    <p className="text-muted-foreground">
                        Adicione ou remova unidades da Polícia Militar.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Nova Unidade</CardTitle>
                        <CardDescription>Cadastre uma nova unidade no sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={addUnit} className="flex gap-2">
                            <Input name="name" placeholder="Nome da Unidade (Ex: 10 BPM-I)" required className="flex-1" />
                            <Button type="submit" className="bg-pm-blue text-white hover:bg-pm-blue/90">
                                <Plus className="w-4 h-4 mr-2" /> Adicionar
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Unidades Cadastradas</CardTitle>
                        <CardDescription>Total: {units.length}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-[400px] overflow-y-auto border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="w-[100px] text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {units.map((unit) => (
                                        <TableRow key={unit.id}>
                                            <TableCell className="font-medium">{unit.name}</TableCell>
                                            <TableCell className="text-right">
                                                <ActionMenu
                                                    onView={() => window.location.assign(`/dashboard/units/${unit.id}`)}
                                                    onEdit={() => window.location.assign(`/dashboard/units/${unit.id}/edit`)}
                                                    onDelete={async () => {
                                                        try {
                                                            const res = await fetch(`/api/units/${unit.id}`, { method: "DELETE" });
                                                            if (!res.ok) throw new Error("delete failed");
                                                            window.location.reload();
                                                        } catch {
                                                            alert("Falha ao excluir a unidade.");
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {units.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                                                Nenhuma unidade cadastrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


import { EquipmentForm } from "@/components/forms/equipment-form";
import { getAllUnits } from "@/server/queries/units";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewEquipmentPage() {
    const units = await getAllUnits();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/equipment">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Novo Equipamento</h2>
                    <p className="text-muted-foreground">Adicione um novo item ao inventário.</p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <EquipmentForm units={units.map(u => u.name)} />
                </CardContent>
            </Card>
        </div>
    );
}


import { auth } from "@clerk/nextjs/server";
import { getUserEquipment } from "@/server/queries/equipment";
import { MyEquipmentCard } from "@/components/dashboard/my-equipment-card";
import { Shield, PackageOpen } from "lucide-react";

export default async function MyEquipmentPage() {
    const { userId } = await auth();
    if (!userId) return null;

    const { data: equipments } = await getUserEquipment(userId);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-full text-slate-700">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Meus Equipamentos</h2>
                    <p className="text-muted-foreground">
                        Gerencie sua carga pessoal e realize devoluções.
                    </p>
                </div>
            </div>

            {equipments.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed">
                    <PackageOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <h3 className="text-lg font-medium text-slate-900">Carga Vazia</h3>
                    <p className="text-muted-foreground">Você não possui equipamentos em sua carga pessoal no momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {equipments.map((eq) => (
                        <MyEquipmentCard key={eq.id} equipment={eq as any} />
                    ))}
                </div>
            )}
        </div >
    );
}

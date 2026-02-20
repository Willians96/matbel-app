
import { checkAdmin } from "@/server/auth";
import { getAllArmas } from "@/server/queries/inventario";
import { getAllColetes } from "@/server/queries/inventario";
import { getAllAlgemas } from "@/server/queries/inventario";
import { getMunicoesBatches } from "@/server/queries/inventario";
import { InventarioClient } from "@/components/dashboard/inventario/inventario-client";
import { Package, ShieldCheck } from "lucide-react";

export default async function InventarioPage() {
    await checkAdmin();

    const [armas, coletes, algemas, municoes] = await Promise.all([
        getAllArmas(),
        getAllColetes(),
        getAllAlgemas(),
        getMunicoesBatches(),
    ]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full shadow-lg shadow-blue-900/20">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-pm-blue">
                        Inventário da Reserva
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        Gerenciamento de armas, coletes, algemas e munições.
                    </p>
                </div>
            </div>

            <InventarioClient
                armas={armas}
                coletes={coletes}
                algemas={algemas}
                municoes={municoes}
            />
        </div>
    );
}

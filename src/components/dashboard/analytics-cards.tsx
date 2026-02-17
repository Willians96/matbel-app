
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";

interface AnalyticsCardsProps {
    data: {
        total: number;
        available: number;
        inUse: number;
        maintenance: number;
    };
}

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total de Itens
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{data.total}</div>
                    <p className="text-xs text-muted-foreground">
                        Arsenal completo registrado
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-600">
                        Disponíveis
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-700">{data.available}</div>
                    <p className="text-xs text-green-600/80">
                        Prontos para uso
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-600">
                        Em Uso (Cautelados)
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-700">{data.inUse}</div>
                    <p className="text-xs text-yellow-600/80">
                        Atualmente com policiais
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white border-slate-100 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-red-600">
                        Manutenção
                    </CardTitle>
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-700">{data.maintenance}</div>
                    <p className="text-xs text-red-600/80">
                        Indisponíveis / Baixados
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

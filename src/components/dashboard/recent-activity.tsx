
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, CalendarClock, ShieldAlert, AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RecentActivity() {
    // Mock data for visual demonstration as requested
    const alerts = [
        {
            id: 1,
            type: "critical",
            title: "Munição .40 (Lote #9822)",
            message: "Vencimento em 15 dias (05/03/2026)",
            icon: CalendarClock,
            color: "text-red-600",
            bg: "bg-red-100",
            border: "border-red-200"
        },
        {
            id: 2,
            type: "warning",
            title: "Coletes Balísticos (Nível III-A)",
            message: "5 unidades com vencimento próximo",
            icon: ShieldAlert,
            color: "text-amber-600",
            bg: "bg-amber-100",
            border: "border-amber-200"
        },
        {
            id: 3,
            type: "low_stock",
            title: "Algemas de Dobradiça",
            message: "Estoque crítico: Apenas 2 unidades",
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-100",
            border: "border-rose-200"
        },
        {
            id: 4,
            type: "info",
            title: "Espargidor Grande",
            message: "Estoque abaixo do ideal (5 unidades)",
            icon: AlertCircle,
            color: "text-blue-600",
            bg: "bg-blue-100",
            border: "border-blue-200"
        }
    ];

    return (
        <Card className="col-span-4 lg:col-span-3 bg-white shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-rose-600 h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-rose-700">
                            <ShieldAlert className="h-5 w-5" />
                            Alertas & Monitoramento
                        </CardTitle>
                        <CardDescription>
                            Atenção requerida para vencimentos e estoque.
                        </CardDescription>
                    </div>
                    <Badge variant="destructive" className="animate-pulse shadow-sm">
                        3 Críticos
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mt-2">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${alert.bg} ${alert.border} transition-all hover:translate-x-1 cursor-pointer group`}
                        >
                            <div className={`p-2 rounded-full bg-white/80 shadow-sm ${alert.color}`}>
                                <alert.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <p className={`text-sm font-bold ${alert.color}`}>
                                    {alert.title}
                                </p>
                                <p className="text-xs text-slate-700 font-medium">
                                    {alert.message}
                                </p>
                            </div>
                            <ArrowRight className={`h-4 w-4 self-center opacity-0 group-hover:opacity-100 transition-opacity ${alert.color}`} />
                        </div>
                    ))}

                    <button className="w-full text-xs text-center text-muted-foreground hover:text-pm-blue mt-2 hover:underline transition-colors">
                        Ver todos os alertas
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

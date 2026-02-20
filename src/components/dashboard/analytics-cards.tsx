
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsCardsProps {
    data: {
        total: number;
        available: number;
        inUse: number;
        maintenance: number;
    };
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function AnalyticsCards({ data }: AnalyticsCardsProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
            <motion.div variants={item}>
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Total de Itens
                        </CardTitle>
                        <Package className="h-4 w-4 text-slate-900" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.total}</div>
                        <p className="text-xs text-muted-foreground">
                            Arsenal completo registrado
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Disponíveis
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{data.available}</div>
                        <p className="text-xs text-muted-foreground">
                            Prontos para uso
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Em Uso (Cautelados)
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{data.inUse}</div>
                        <p className="text-xs text-muted-foreground">
                            Atualmente com policiais
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">
                            Manutenção
                        </CardTitle>
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{data.maintenance}</div>
                        <p className="text-xs text-muted-foreground">
                            Itens indisponíveis
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

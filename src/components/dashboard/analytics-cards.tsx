
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
            <motion.div variants={item} className="h-full">
                <Card className="h-full flex flex-col justify-between bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-slate-900 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 truncate">
                            Total de Itens
                        </CardTitle>
                        <Package className="h-4 w-4 text-slate-900 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.total}</div>
                        <p className="text-xs text-muted-foreground truncate" title="Arsenal completo registrado">
                            Arsenal completo registrado
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
                <Card className="h-full flex flex-col justify-between bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-green-500 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 truncate">
                            Disponíveis
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.available}</div>
                        <p className="text-xs text-muted-foreground truncate" title="Prontos para uso imediato">
                            Prontos para uso imediato
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
                <Card className="h-full flex flex-col justify-between bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-amber-500 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 truncate">
                            Em Uso (Em Serviço)
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.inUse}</div>
                        <p className="text-xs text-muted-foreground truncate" title="Materiais em uso ativo">
                            Materiais em uso ativo
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item} className="h-full">
                <Card className="h-full flex flex-col justify-between bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-rose-500 group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 truncate">
                            Manutenção
                        </CardTitle>
                        <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{data.maintenance}</div>
                        <p className="text-xs text-muted-foreground truncate" title="Indisponíveis / Quebrados">
                            Indisponíveis / Quebrados
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}

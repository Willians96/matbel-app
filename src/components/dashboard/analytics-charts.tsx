"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const STATUS_COLORS = {
    available: "#22c55e", // Green
    inUse: "#eab308",    // Yellow
    maintenance: "#ef4444", // Red
};

const CATEGORY_COLORS = ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

interface ChartsProps {
    statusData: { name: string; value: number }[];
    categoryData: { name: string; value: number }[];
}

export function AnalyticsCharts({ statusData, categoryData }: ChartsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Pie Chart: Status Distribution */}
            <Card className="col-span-3 bg-white shadow-sm border-slate-100">
                <CardHeader>
                    <CardTitle>Status do Arsenal</CardTitle>
                    <CardDescription>Distribuição atual dos equipamentos.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => {
                                        let color = STATUS_COLORS.available;
                                        if (entry.name === 'Em Uso') color = STATUS_COLORS.inUse;
                                        if (entry.name === 'Manutenção') color = STATUS_COLORS.maintenance;
                                        return <Cell key={`cell-${index}`} fill={color} />;
                                    })}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart: Categories */}
            <Card className="col-span-4 bg-white shadow-sm border-slate-100">
                <CardHeader>
                    <CardTitle>Equipamentos por Categoria</CardTitle>
                    <CardDescription>Quantitativo por tipo de material.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

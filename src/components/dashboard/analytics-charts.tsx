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
            <Card className="col-span-3 bg-white shadow-sm border-slate-100 hover:shadow-md transition-all duration-200">
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
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {statusData.map((entry, index) => {
                                        let color = STATUS_COLORS.available;
                                        if (entry.name === 'Em Uso') color = STATUS_COLORS.inUse;
                                        if (entry.name === 'Manutenção') color = STATUS_COLORS.maintenance;
                                        return <Cell key={`cell-${index}`} fill={color} stroke="none" />;
                                    })}
                                </Pie>
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 500 }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart: Categories */}
            <Card className="col-span-4 bg-white shadow-sm border-slate-100 hover:shadow-md transition-all duration-200">
                <CardHeader>
                    <CardTitle>Equipamentos por Categoria</CardTitle>
                    <CardDescription>Quantitativo por tipo de material.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} barSize={40}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9', radius: 4 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 500 }}
                                />
                                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

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
            <Card className="col-span-4 bg-white shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-pm-blue h-full">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-pm-blue">Status do Arsenal</CardTitle>
                    <CardDescription>Visão gráfica da disponibilidade atual.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    <linearGradient id="gradAvailable" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity={1} />
                                    </linearGradient>
                                    <linearGradient id="gradInUse" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fde047" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#eab308" stopOpacity={1} />
                                    </linearGradient>
                                    <linearGradient id="gradMaintenance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={8}
                                >
                                    {statusData.map((entry, index) => {
                                        let fillId = "url(#gradAvailable)";
                                        if (entry.name === 'Em Uso') fillId = "url(#gradInUse)";
                                        if (entry.name === 'Manutenção') fillId = "url(#gradMaintenance)";
                                        return <Cell key={`cell-${index}`} fill={fillId} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />;
                                    })}
                                </Pie>
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 600, fontSize: '14px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    iconSize={12}
                                    wrapperStyle={{ paddingTop: '20px', fontWeight: 500 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart: Categories */}
            <Card className="col-span-3 bg-white shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-slate-800 h-full">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">Categorias</CardTitle>
                    <CardDescription>Quantidade por tipo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} barSize={32} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="gradBar" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#1e293b" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#0f172a" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    width={100}
                                    fontWeight={500}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: 8 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                                />
                                <Bar dataKey="value" fill="url(#gradBar)" radius={[0, 8, 8, 0]} animationDuration={1500} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState } from "react";
import { Search, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui";
import { searchUserByRe, updateUserRole } from "@/server/actions/settings";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type UserResult = {
    id: string;
    name: string;
    re: string | null;
    rank: string | null;
    unit: string | null;
    role: "admin" | "user";
};

export function AdminManager() {
    const [re, setRe] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserResult | null>(null);

    async function handleSearch() {
        if (!re) return;
        setLoading(true);
        setUser(null);

        try {
            const result = await searchUserByRe(re);
            if (result.success && result.data) {
                setUser(result.data as UserResult);
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Erro ao buscar usuário.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRoleUpdate(targetRole: 'admin' | 'user') {
        if (!user) return;
        setLoading(true);

        try {
            const result = await updateUserRole(user.id, targetRole);
            if (result.success) {
                toast.success(result.message);
                setUser((prev) => prev ? { ...prev, role: targetRole } : null);
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Erro ao atualizar permissão.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                    <ShieldCheck className="w-5 h-5 text-pm-blue" />
                    Gerenciamento de Administradores
                </CardTitle>
                <CardDescription>
                    Pesquise por RE para delegar ou revogar permissões administrativas.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input
                        placeholder="Digite o RE do policial..."
                        value={re}
                        onChange={(e) => setRe(e.target.value)}
                        className="max-w-xs bg-slate-50 border-slate-200 focus:border-pm-blue focus:ring-pm-blue/20"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={loading || !re}
                        className="bg-pm-blue text-white hover:bg-pm-blue/90"
                    >
                        {loading ? "Buscando..." : <Search className="w-4 h-4" />}
                    </Button>
                </div>

                {user && (
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=002147&color=fff`} />
                                <AvatarFallback className="bg-pm-blue text-white">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="font-semibold text-slate-900">{user.name}</h4>
                                <div className="text-sm text-slate-500 flex gap-2 items-center">
                                    <span>{user.rank || "N/A"}</span>
                                    <span>•</span>
                                    <span>RE: {user.re}</span>
                                    <span>•</span>
                                    <span>{user.unit || "Sem Unidade"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-pm-blue hover:bg-pm-blue/90' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}>
                                {user.role === 'admin' ? 'Administrador' : 'Usuário Padrão'}
                            </Badge>

                            {user.role === 'user' ? (
                                <Button
                                    size="sm"
                                    onClick={() => handleRoleUpdate('admin')}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-8"
                                >
                                    <Shield className="w-3 h-3 mr-1.5" />
                                    Promover a Admin
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRoleUpdate('user')}
                                    disabled={loading}
                                    className="shadow-sm h-8"
                                >
                                    <ShieldAlert className="w-3 h-3 mr-1.5" />
                                    Remover Admin
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

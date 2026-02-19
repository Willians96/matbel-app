"use client";

import { useState, useTransition } from "react";
import { toggleUserRole } from "@/server/actions/users";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Shield, User, Users } from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    re: string | null;
    unit: string | null;
}

export function UserList({ users }: { users: UserData[] }) {
    const [isPending, startTransition] = useTransition();

    function handleToggleRole(userId: string, currentRole: string) {
        const newRole = currentRole === "admin" ? "user" : "admin";

        startTransition(async () => {
            const result = await toggleUserRole(userId, newRole);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pm-blue" />
                    Gestão de Usuários
                </CardTitle>
                <CardDescription>
                    Gerencie quem tem acesso administrativo ao sistema.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b font-medium text-sm text-muted-foreground">
                        <div className="col-span-5">Usuário</div>
                        <div className="col-span-3">Unidade</div>
                        <div className="col-span-2">Função</div>
                        <div className="col-span-2 text-right">Ações</div>
                    </div>
                    <div className="divide-y">
                        {users.map((user) => (
                            <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm">
                                <div className="col-span-5">
                                    <div className="font-semibold text-slate-900">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                    <div className="text-xs text-muted-foreground">RE: {user.re || "N/A"}</div>
                                </div>
                                <div className="col-span-3 text-slate-600">
                                    {user.unit || "-"}
                                </div>
                                <div className="col-span-2">
                                    {user.role === "admin" ? (
                                        <Badge variant="default" className="bg-pm-blue hover:bg-pm-blue/80 gap-1">
                                            <Shield className="w-3 h-3" /> Admin
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1">
                                            <User className="w-3 h-3" /> Usuário
                                        </Badge>
                                    )}
                                </div>
                                <div className="col-span-2 text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isPending}
                                        onClick={() => handleToggleRole(user.id, user.role)}
                                    >
                                        {user.role === "admin" ? "Rebaixar" : "Promover"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

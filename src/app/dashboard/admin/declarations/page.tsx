
import { db } from "@/db";
import { declarations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { approveDeclaration, rejectDeclaration } from "@/server/actions/declarations-admin";

import { checkAdmin } from "@/server/auth";

export default async function AdminDeclarationsPage() {
    await checkAdmin();
    const pendingDeclarations = await db.query.declarations.findMany({
        where: eq(declarations.status, "pending"),
        orderBy: [desc(declarations.createdAt)],
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full shadow-lg shadow-blue-900/20">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-pm-blue">Solicitações de Carga</h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        Valide as declarações de material permanente enviadas pelos policiais.
                    </p>
                </div>
            </div>

            {pendingDeclarations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm text-muted-foreground">
                    <div className="p-4 bg-slate-100 rounded-full w-fit mx-auto mb-4">
                        <FileText className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Nenhuma solicitação pendente</h3>
                    <p className="text-sm mt-1">Todas as declarações foram processadas.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingDeclarations.map((decl) => (
                        <Card key={decl.id} className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">{decl.userRank} {decl.userName}</CardTitle>
                                <CardDescription>RE: {decl.userRe} • {decl.userUnit}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="p-3 bg-slate-50 rounded-md space-y-1">
                                    <p><span className="font-semibold">Armamento:</span> {decl.gunSerialNumber || "Não declarado"}</p>
                                    <p><span className="font-semibold">Colete:</span> {decl.vestSerialNumber || "Não declarado"}</p>
                                    <p>
                                        <span className="font-semibold">Algemas:</span>{" "}
                                        {decl.hasHandcuffs ? (decl.handcuffsSerialNumber || "Sim (Sem Serial)") : "Não"}
                                    </p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enviado em: {decl.createdAt ? new Date(decl.createdAt).toLocaleDateString("pt-BR") : "-"}
                                </p>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2 pt-2">
                                <form action={async () => {
                                    "use server";
                                    await rejectDeclaration(decl.id);
                                }}>
                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <XCircle className="w-4 h-4 mr-1" /> Rejeitar
                                    </Button>
                                </form>

                                <form action={async () => {
                                    "use server";
                                    await approveDeclaration(decl.id);
                                }}>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Aprovar
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

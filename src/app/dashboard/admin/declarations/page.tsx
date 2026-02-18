
import { db } from "@/db";
import { declarations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { approveDeclaration, rejectDeclaration } from "@/server/actions/declarations-admin";
import { revalidatePath } from "next/cache";

import { checkAdmin } from "@/server/auth";

export default async function AdminDeclarationsPage() {
    await checkAdmin();
    const pendingDeclarations = await db.query.declarations.findMany({
        where: eq(declarations.status, "pending"),
        orderBy: [desc(declarations.createdAt)],
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Solicitações de Carga</h2>
                <p className="text-muted-foreground">
                    Valide as declarações de material permanente enviadas pelos policiais.
                </p>
            </div>

            {pendingDeclarations.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Nenhuma solicitação pendente.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pendingDeclarations.map((decl) => (
                        <Card key={decl.id} className="border-l-4 border-l-yellow-500 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{decl.userRank} {decl.userName}</CardTitle>
                                <CardDescription>RE: {decl.userRe} • Unit: {decl.userUnit}</CardDescription>
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
                                    Enviado em: {decl.createdAt ? new Date(decl.createdAt).toLocaleDateString() : "-"}
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

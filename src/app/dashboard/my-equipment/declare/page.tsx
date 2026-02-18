import { DeclarationForm } from "@/components/forms/declaration-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { db } from "@/db";
import { declarations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

export default async function DeclareEquipmentPage() {
    const user = await currentUser();
    let initialData = null;

    if (user) {
        initialData = await db.query.declarations.findFirst({
            where: eq(declarations.userId, user.id),
            orderBy: [desc(declarations.createdAt)],
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-pm-blue text-white rounded-full">
                    <FileText className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-pm-blue">Carga Pessoal</h2>
                    <p className="text-muted-foreground">
                        Declaração de material permanente
                    </p>
                </div>
            </div>

            <DeclarationForm initialData={initialData} />
        </div>
    );
}

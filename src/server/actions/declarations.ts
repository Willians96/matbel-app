"use server";

import { db } from "@/db";
import { declarations, users } from "@/db/schema";
import { declarationSchema } from "@/lib/validations/declaration";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type DeclarationState = {
    success: boolean;
    message: string;
};

export async function createDeclaration(data: z.infer<typeof declarationSchema>): Promise<DeclarationState> {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, message: "Usuário não autenticado." };
    }

    // Get User Profile
    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!userProfile || !userProfile.re || !userProfile.unit) {
        return { success: false, message: "Perfil incompleto. Atualize seus dados primeiro." };
    }

    try {
        // Auto-approve if it's the first declaration
        const existingDeclarations = await db.query.declarations.findFirst({
            where: eq(declarations.userId, userId),
        });

        const initialStatus = existingDeclarations ? "pending" : "approved";

        await db.insert(declarations).values({
            userId: userId,
            userRe: userProfile.re,
            userName: userProfile.warName || userProfile.name,
            userRank: userProfile.rank,
            userUnit: userProfile.unit,
            gunSerialNumber: data.gunSerialNumber || null,
            vestSerialNumber: data.vestSerialNumber || null,
            hasHandcuffs: data.hasHandcuffs,
            handcuffsSerialNumber: data.handcuffsSerialNumber || null,
            status: initialStatus,
        });

        const successMessage = initialStatus === 'approved'
            ? "Declaração registrada e aprovada automaticamente!"
            : "Solicitação enviada para análise do admin.";

        revalidatePath("/dashboard");
        return { success: true, message: successMessage };
    } catch (error) {
        console.error("Erro ao criar declaração:", error);
        return { success: false, message: "Erro ao salvar declaração. Tente novamente." };
    }
}

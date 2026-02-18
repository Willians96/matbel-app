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
            status: "pending",
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Declaração enviada com sucesso! Aguarde aprovação." };
    } catch (error) {
        console.error("Erro ao criar declaração:", error);
        return { success: false, message: "Erro ao salvar declaração. Tente novamente." };
    }
}

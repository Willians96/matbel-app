"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentUser } from "@clerk/nextjs/server";

export type ProfileState = {
    success: boolean;
    message: string;
};

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
    const user = await currentUser();
    if (!user) return { success: false, message: "Não autorizado." };

    const re = formData.get("re") as string;
    const rank = formData.get("rank") as string;
    const warName = formData.get("warName") as string;
    const unit = formData.get("unit") as string;

    if (!re || !rank || !warName || !unit) {
        return { success: false, message: "Preencha todos os campos." };
    }

    try {
        await db.update(users)
            .set({
                re,
                rank,
                warName,
                unit
            })
            .where(eq(users.id, user.id));

        revalidatePath("/dashboard/profile");
        return { success: true, message: "Perfil atualizado com sucesso!" };
    } catch (error) {
        console.error("Profile Update Error:", error);
        // Check for unique constraint violation on RE
        if (String(error).includes("UNIQUE constraint failed: users.re")) {
            return { success: false, message: "Este RE já está em uso por outro usuário." };
        }
        return { success: false, message: "Erro ao atualizar perfil." };
    }
}

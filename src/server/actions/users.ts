"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { checkAdmin } from "@/server/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UserActionState = {
    success: boolean;
    message: string;
};

export async function toggleUserRole(targetUserId: string, newRole: "admin" | "user"): Promise<UserActionState> {
    try {
        // Security check: Only admins can change roles
        await checkAdmin();

        await db.update(users)
            .set({ role: newRole })
            .where(eq(users.id, targetUserId));

        revalidatePath("/dashboard/settings");
        return { success: true, message: `Função do usuário atualizada para ${newRole}.` };

    } catch (error) {
        console.error("Toggle Role Error:", error);
        return { success: false, message: "Erro ao atualizar permissões." };
    }
}

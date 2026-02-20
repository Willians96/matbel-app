"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/auth";

export async function searchUserByRe(re: string) {
    await checkAdmin();

    if (!re) return { success: false, message: "RE é obrigatório." };

    try {
        const user = await db.select().from(users).where(eq(users.re, re)).get();

        if (user) {
            return {
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    re: user.re,
                    rank: user.rank,
                    unit: user.unit,
                    role: user.role,
                }
            };
        }
        return { success: false, message: "Usuário não encontrado." };
    } catch (error) {
        console.error("Error fetching user by RE:", error);
        return { success: false, message: "Erro ao buscar usuário." };
    }
}

export async function updateUserRole(userId: string, targetRole: 'admin' | 'user') {
    await checkAdmin();

    try {
        await db.update(users)
            .set({ role: targetRole })
            .where(eq(users.id, userId));

        revalidatePath("/dashboard/settings");
        return { success: true, message: `Permissão atualizada para ${targetRole === 'admin' ? 'Administrador' : 'Usuário'}.` };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, message: "Erro ao atualizar permissão." };
    }
}

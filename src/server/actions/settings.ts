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
                    warName: user.warName,
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

export async function updateUserData(userId: string, data: {
    name: string;
    re: string;
    rank: string;
    warName: string;
    unit: string;
}) {
    await checkAdmin();

    if (!userId) return { success: false, message: "ID do usuário é obrigatório." };
    if (!data.name || !data.re) return { success: false, message: "Nome e RE são obrigatórios." };

    try {
        await db.update(users)
            .set({
                name: data.name,
                re: data.re,
                rank: data.rank,
                warName: data.warName,
                unit: data.unit,
            })
            .where(eq(users.id, userId));

        revalidatePath("/dashboard/settings");
        revalidatePath("/dashboard/equipment");
        revalidatePath("/dashboard/admin/history");
        return { success: true, message: "Dados do usuário atualizados com sucesso." };
    } catch (error) {
        console.error("Error updating user data:", error);
        return { success: false, message: "Erro ao atualizar dados. Verifique se o RE já está em uso." };
    }
}

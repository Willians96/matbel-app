"use server";

import { db } from "@/db";
import { units } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createUnit(name: string) {
    if (!name || name.trim().length === 0) {
        return { success: false, message: "Nome da unidade inválido." };
    }

    try {
        await db.insert(units).values({
            name: name.trim().toUpperCase(),
            active: true,
        });
        revalidatePath("/dashboard/units");
        return { success: true, message: "Unidade criada com sucesso." };
    } catch (error) {
        const msg = (error as Error & { message?: string })?.message;
        if (msg?.includes("UNIQUE constraint failed")) {
            return { success: false, message: "Esta unidade já existe." };
        }
        return { success: false, message: "Erro ao criar unidade." };
    }
}

export async function deleteUnit(id: number) {
    try {
        await db.delete(units).where(eq(units.id, id));
        revalidatePath("/dashboard/units");
        return { success: true, message: "Unidade removida." };
    } catch (error) {
        return { success: false, message: "Erro ao remover unidade." };
    }
}

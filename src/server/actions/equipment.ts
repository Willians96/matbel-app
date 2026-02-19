
'use server';

import { db } from "@/db";
import { equipamentos } from "@/db/schema";
import { equipmentSchema } from "@/lib/validations/equipment";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createEquipment(values: z.infer<typeof equipmentSchema>) {
    const user = await currentUser();

    if (!user) {
        return { success: false, message: "Usuário não autenticado." };
    }

    const validatedFields = equipmentSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, message: "Campos inválidos." };
    }

    const { name, serialNumber, patrimony, category, unit, status, observations } = validatedFields.data;

    try {
        await db.insert(equipamentos).values({
            name,
            serialNumber,
            patrimony: patrimony || null,
            category,
            unit,
            status: status as "disponivel" | "em_uso" | "manutencao" | "baixado",
            observations,
            userId: user.id,
            acquisitionDate: new Date(),
        });

        revalidatePath("/dashboard/equipment");
        return { success: true, message: "Equipamento cadastrado com sucesso!" };
    } catch (error) {
        const msg = (error as Error & { message?: string })?.message;
        if (msg?.includes("UNIQUE constraint failed")) {
            return { success: false, message: "Este número de série já existe." };
        }
        console.error("Erro ao criar equipamento:", error);
        return { success: false, message: "Erro ao cadastrar equipamento." };
    }
}

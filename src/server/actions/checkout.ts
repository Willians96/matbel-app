"use server";

import { db } from "@/db";
import { equipamentos, transactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CheckoutState = {
    success: boolean;
    message: string;
    errors?: {
        serialNumber?: string[];
        userRe?: string[];
        userName?: string[];
        userUnit?: string[];
    };
};

export async function processCheckout(prevState: CheckoutState, formData: FormData): Promise<CheckoutState> {
    const serialNumber = formData.get("serialNumber") as string;
    const userRe = formData.get("userRe") as string;
    const userName = formData.get("userName") as string;
    const userUnit = formData.get("userUnit") as string;

    if (!serialNumber || !userRe || !userName || !userUnit) {
        return { success: false, message: "Preencha todos os campos obrigatórios." };
    }

    try {
        // 1. Find Equipment
        const equipmentList = await db.select().from(equipamentos).where(eq(equipamentos.serialNumber, serialNumber)).limit(1);
        const equipment = equipmentList[0];

        if (!equipment) {
            return { success: false, message: "Equipamento não encontrado." };
        }

        // 2. Check Availability
        if (equipment.status !== "disponivel") {
            return { success: false, message: `Equipamento indisponível (Status: ${equipment.status}).` };
        }

        // 3. Create Transaction
        await db.insert(transactions).values({
            equipmentId: equipment.id,
            userRe,
            userName,
            userUnit,
            status: "active",
            // checkoutDate is default Now()
        });

        // 4. Update Equipment Status
        await db.update(equipamentos)
            .set({ status: "em_uso" })
            .where(eq(equipamentos.id, equipment.id));

        revalidatePath("/dashboard/equipment");
        return { success: true, message: "Cautela realizada com sucesso! Equipamento liberado." };

    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, message: "Erro interno ao processar cautela." };
    }
}

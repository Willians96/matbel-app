"use server";

import { db } from "@/db";
import { equipamentos, transfers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserByRE } from "@/server/actions/user-lookup";
import { currentUser } from "@clerk/nextjs/server";

export type CheckoutState = {
    success: boolean;
    message: string;
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
        const admin = await currentUser();
        if (!admin) {
            return { success: false, message: "Não autorizado." };
        }

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

        // 3. Find User
        const targetUser = await getUserByRE(userRe);
        if (!targetUser || !targetUser.id) {
            // Fallback: If we can't find the user by RE safely in our DB (maybe sync issue), we can't create a transfer linked to ID.
            // For now, let's assume all users must be in the system.
            return { success: false, message: "Usuário não encontrado no sistema. Verifique o RE." };
        }

        // 4. Create Transfer
        await db.insert(transfers).values({
            equipmentId: equipment.id,
            adminId: admin.id,
            userId: targetUser.id,
            type: "allocation",
            status: "pending",
            // timestamp will be updated on confirmation
        });

        // 5. Update Equipment Status
        // We set it to 'em_uso' (In Use) immediately to prevent other checkouts.
        // If the user rejects, we'll need a flow to revert this (or admin cancels).
        await db.update(equipamentos)
            .set({ status: "em_uso", userId: targetUser.id }) // Bind equipment to user immediately as well? Or wait? Transfer says "pending".
            // Let's bind it for now so it shows up in their inventory potentially, or maybe just status change.
            // If we set userId here, it might show as "Possui" before they accept.
            // Let's just set status 'em_uso' for now.
            .where(eq(equipamentos.id, equipment.id));

        revalidatePath("/dashboard/equipment");
        return { success: true, message: "Carga Pessoal iniciada! Aguardando confirmação do policial." };

    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, message: "Erro interno ao processar carga pessoal." };
    }
}

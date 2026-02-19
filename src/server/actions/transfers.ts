"use server";

import { db } from "@/db";
import { equipamentos, transfers, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export type TransferState = {
    success: boolean;
    message: string;
    transferId?: string;
};

// 1. Admin Initiates Transfer (Allocation) or User Initiates Return
export async function createTransfer(
    type: "allocation" | "return",
    equipmentId: number,
    targetUserId: string // If allocation: UserID. If return: AdminID (or just system)
): Promise<TransferState> {
    const { userId: actorId } = await auth();
    if (!actorId) return { success: false, message: "Não autorizado" };

    try {
        // Verify Equipment
        const equipment = await db.query.equipamentos.findFirst({
            where: eq(equipamentos.id, equipmentId),
        });

        if (!equipment) return { success: false, message: "Equipamento não encontrado" };

        // Determine participants
        let adminId: string | null = null;
        let userId: string = "";

        if (type === "allocation") {
            // Actor is Admin
            adminId = actorId;
            userId = targetUserId;
            if (equipment.status !== 'disponivel') {
                return { success: false, message: "Equipamento não está disponível para entrega." };
            }
        } else {
            // Actor is User (Returning)
            adminId = null; // Will be claimed by admin who confirms? Or just system.
            userId = actorId;
            if (equipment.userId !== userId) {
                return { success: false, message: "Este equipamento não pertence a você." };
            }
        }

        await db.insert(transfers).values({
            type,
            equipmentId,
            adminId,
            userId,
            status: "pending",
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Solicitação de transferência criada!" };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Erro ao criar transferência" };
    }
}

// 2. User/Admin Confirms Transfer
export async function confirmTransfer(transferId: string): Promise<TransferState> {
    const { userId: actorId } = await auth();
    if (!actorId) return { success: false, message: "Não autorizado" };

    try {
        const transfer = await db.query.transfers.findFirst({
            where: eq(transfers.id, transferId),
            with: {
                equipment: true,
                user: true,
            }
        });

        if (!transfer || transfer.status !== "pending") {
            return { success: false, message: "Transferência inválida ou já processada." };
        }

        // Generate Digital Signature (Simple Hash Simulation)
        const signature = `SIG-${Date.now()}-${transfer.equipmentId}-${transfer.userId.substring(0, 8)}`;

        // Execute ownership change
        if (transfer.type === "allocation") {
            // User Checking Out (Confirming Receipt)
            if (transfer.userId !== actorId) {
                return { success: false, message: "Apenas o destinatário pode confirmar o recebimento." };
            }

            await db.transaction(async (tx) => {
                // Update Transfer
                await tx.update(transfers)
                    .set({
                        status: "confirmed",
                        signature,
                        timestamp: new Date()
                    })
                    .where(eq(transfers.id, transferId));

                // Update Equipment
                await tx.update(equipamentos)
                    .set({
                        status: "em_uso",
                        userId: transfer.userId
                    })
                    .where(eq(equipamentos.id, transfer.equipmentId));
            });

        } else {
            // User Returning (Admin Confirming)
            // Ideally check if actor is admin
            await db.transaction(async (tx) => {
                await tx.update(transfers)
                    .set({
                        status: "confirmed",
                        signature,
                        timestamp: new Date(),
                        adminId: actorId // Capture who confirmed
                    })
                    .where(eq(transfers.id, transferId));

                await tx.update(equipamentos)
                    .set({
                        status: "disponivel",
                        userId: null
                    })
                    .where(eq(equipamentos.id, transfer.equipmentId));
            });
        }

        revalidatePath("/dashboard");
        return { success: true, message: "Transferência confirmada com sucesso!", transferId };

    } catch (error) {
        console.error(error);
        return { success: false, message: "Erro ao confirmar transferência" };
    }
}

// 3. Rejection
// 3. Rejection
export async function rejectTransfer(transferId: string): Promise<TransferState> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Não autorizado" };

    try {
        const transfer = await db.query.transfers.findFirst({
            where: eq(transfers.id, transferId),
            with: { equipment: true }
        });

        if (!transfer || transfer.status !== "pending") {
            return { success: false, message: "Transferência inválida." };
        }

        await db.transaction(async (tx) => {
            // Update Transfer Status
            await tx.update(transfers)
                .set({ status: "rejected" })
                .where(eq(transfers.id, transferId));

            // If it was an allocation, we must free the equipment
            if (transfer.type === "allocation") {
                await tx.update(equipamentos)
                    .set({
                        status: "disponivel",
                        userId: null
                    })
                    .where(eq(equipamentos.id, transfer.equipmentId));
            }
        });

        revalidatePath("/dashboard");
        return { success: true, message: "Transferência rejeitada." };
    } catch (error) {
        console.error("Reject Error:", error);
        return { success: false, message: "Erro ao rejeitar." };
    }
}

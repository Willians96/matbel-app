"use server";

import { db } from "@/db";
import { declarations, equipamentos, users } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveDeclaration(declarationId: string) {
    const { userId } = await auth();
    // In a real app, verify admin role here. For now, assuming middleware handles route protection.

    // 1. Get Declaration
    const declaration = await db.query.declarations.findFirst({
        where: eq(declarations.id, declarationId),
    });

    if (!declaration) {
        return { success: false, message: "Declaração não encontrada." };
    }

    if (declaration.status !== "pending") {
        return { success: false, message: "Declaração já processada." };
    }

    try {
        // 2. Process Gun
        if (declaration.gunSerialNumber) {
            // Check if exists
            const existingGun = await db.query.equipamentos.findFirst({
                where: eq(equipamentos.serialNumber, declaration.gunSerialNumber),
            });

            if (existingGun) {
                // Link to user if available or currently assigned to same user?
                // For simplicity: Force update to this user and set to 'em_uso'
                await db.update(equipamentos)
                    .set({
                        userId: declaration.userId,
                        status: "em_uso",
                        unit: declaration.userUnit
                    })
                    .where(eq(equipamentos.id, existingGun.id));
            } else {
                // Create new
                await db.insert(equipamentos).values({
                    name: "Pistola (Carga Pessoal)",
                    category: "Armamento",
                    serialNumber: declaration.gunSerialNumber,
                    unit: declaration.userUnit,
                    status: "em_uso",
                    userId: declaration.userId,
                    acquisitionDate: new Date(),
                    observations: "Declarado pelo usuário em Carga Pessoal",
                });
            }
        }

        // 3. Process Vest
        if (declaration.vestSerialNumber) {
            const existingVest = await db.query.equipamentos.findFirst({
                where: eq(equipamentos.serialNumber, declaration.vestSerialNumber),
            });

            if (existingVest) {
                await db.update(equipamentos)
                    .set({ userId: declaration.userId, status: "em_uso", unit: declaration.userUnit })
                    .where(eq(equipamentos.id, existingVest.id));
            } else {
                await db.insert(equipamentos).values({
                    name: "Colete Balístico",
                    category: "Colete",
                    serialNumber: declaration.vestSerialNumber,
                    unit: declaration.userUnit,
                    status: "em_uso",
                    userId: declaration.userId,
                    acquisitionDate: new Date(),
                    observations: "Declarado pelo usuário em Carga Pessoal",
                });
            }
        }

        // 4. Process Handcuffs
        if (declaration.hasHandcuffs && declaration.handcuffsSerialNumber) {
            const existingHandcuffs = await db.query.equipamentos.findFirst({
                where: eq(equipamentos.serialNumber, declaration.handcuffsSerialNumber),
            });

            if (existingHandcuffs) {
                await db.update(equipamentos)
                    .set({ userId: declaration.userId, status: "em_uso", unit: declaration.userUnit })
                    .where(eq(equipamentos.id, existingHandcuffs.id));
            } else {
                await db.insert(equipamentos).values({
                    name: "Algema",
                    category: "Acessório",
                    serialNumber: declaration.handcuffsSerialNumber,
                    unit: declaration.userUnit,
                    status: "em_uso",
                    userId: declaration.userId,
                    acquisitionDate: new Date(),
                    observations: "Declarado pelo usuário em Carga Pessoal",
                });
            }
        }

        // 5. Update Declaration Status
        await db.update(declarations)
            .set({ status: "approved", updatedAt: new Date() })
            .where(eq(declarations.id, declarationId));

        revalidatePath("/dashboard/admin/declarations");
        revalidatePath("/dashboard/profile");
        return { success: true, message: "Declaração aprovada e materiais vinculados." };

    } catch (error) {
        console.error("Erro ao aprovar declaração:", error);
        return { success: false, message: "Erro ao processar. Verifique se os seriais já existem." };
    }
}

export async function rejectDeclaration(declarationId: string) {
    try {
        await db.update(declarations)
            .set({ status: "rejected", updatedAt: new Date() })
            .where(eq(declarations.id, declarationId));

        revalidatePath("/dashboard/admin/declarations");
        return { success: true, message: "Declaração rejeitada." };
    } catch (error) {
        return { success: false, message: "Erro ao rejeitar." };
    }
}

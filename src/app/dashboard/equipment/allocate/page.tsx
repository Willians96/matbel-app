
import { db } from "@/db";
import { equipamentos, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { TransferAllocationForm } from "@/components/forms/transfer-allocation-form";
import { checkAdmin } from "@/server/auth";

export default async function AllocatePage() {
    await checkAdmin();

    // Fetch Users
    const allUsers = await db.query.users.findMany({
        orderBy: [asc(users.name)],
    });

    // Fetch Available Equipment
    const availableEquipment = await db.query.equipamentos.findMany({
        where: eq(equipamentos.status, "disponivel"),
        orderBy: [asc(equipamentos.name)],
    });

    return (
        <TransferAllocationForm
            users={allUsers}
            equipments={availableEquipment}
        />
    );
}

"use server";

import { db } from "@/db";
import { equipamentos } from "@/db/schema";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";

export async function processBulkImport(formData: FormData) {
    try {
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, error: "Nenhum arquivo enviado." };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        let count = 0;

        for (const row of jsonData as Array<Record<string, unknown>>) {
            // Map Excel columns to Database columns
            // Expected Excel Headers: SERIAL, NOME, CATEGORIA, UNIDADE, PATRIMONIO
            const serialNumber = row['SERIAL'] || row['serial'];
            const name = row['NOME'] || row['nome'];
            const category = row['CATEGORIA'] || row['categoria'];
            const unit = row['UNIDADE'] || row['unidade'];
            const patrimony = row['PATRIMONIO'] || row['patrimonio']?.toString();

            if (serialNumber && name && category) {
                try {
                    await db.insert(equipamentos).values({
                        serialNumber: String(serialNumber),
                        name: String(name),
                        category: String(category),
                        unit: String(unit || "Estoque"),
                        patrimony: patrimony ? String(patrimony) : null,
                        status: "disponivel",
                        acquisitionDate: new Date(),
                    });
                    count++;
                } catch {
                    // Ignora duplicados silenciosamente ou loga
                    console.log(`Skipping duplicate serial: ${serialNumber}`);
                }
            }
        }

        revalidatePath("/dashboard/equipment");
        return { success: true, count };

    } catch (error) {
        console.error("Bulk Import Error:", error);
        return { success: false, error: "Erro ao processar o arquivo." };
    }
}

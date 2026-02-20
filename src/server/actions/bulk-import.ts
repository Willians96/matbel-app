"use server";

import { db } from "@/db";
import { armas, coletes, algemas, municoes } from "@/db/schema";
import { equipamentos } from "@/db/schema";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";
import { checkAdmin } from "@/server/auth";

// ─── Result type ─────────────────────────────────────────────

type ImportResult = {
    success: true;
    inserted: number;
    skipped: number;
    errors: string[];
} | { success: false; error: string };

// ─── Helpers ──────────────────────────────────────────────────

function col(row: Record<string, unknown>, ...keys: string[]): string | undefined {
    for (const k of keys) {
        const v = row[k] ?? row[k.toLowerCase()] ?? row[k.toUpperCase()];
        if (v != null) return String(v).trim();
    }
    return undefined;
}

function parseDate(val: string | undefined): Date | null {
    if (!val) return null;
    // Supports DD/MM/AAAA or AAAA-MM-DD
    if (val.includes("/")) {
        const [d, m, y] = val.split("/");
        return new Date(`${y}-${m}-${d}`);
    }
    return new Date(val);
}

async function parseXlsx(formData: FormData): Promise<Array<Record<string, unknown>>> {
    const file = formData.get("file") as File;
    if (!file) throw new Error("Nenhum arquivo enviado.");
    const bytes = await file.arrayBuffer();
    const wb = XLSX.read(Buffer.from(bytes), { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws) as Array<Record<string, unknown>>;
}

// ─── ARMAS ───────────────────────────────────────────────────

/**
 * Colunas esperadas: PATRIMONIO*, SERIE*, NOME*
 * Opcionais: CALIBRE, FABRICANTE, ACABAMENTO
 */
export async function importArmas(formData: FormData): Promise<ImportResult> {
    await checkAdmin();
    try {
        const rows = await parseXlsx(formData);
        let inserted = 0, skipped = 0;
        const errors: string[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const patrimony = col(row, "PATRIMONIO", "patrimônio", "patrimonio");
            const serialNumber = col(row, "SERIE", "série", "serie", "NÚMERO DE SÉRIE");
            const name = col(row, "NOME", "nome", "DESCRIÇÃO", "descricao");

            if (!patrimony || !serialNumber || !name) {
                errors.push(`Linha ${i + 2}: Campos obrigatórios ausentes (PATRIMONIO, SERIE, NOME).`);
                continue;
            }

            try {
                await db.insert(armas).values({
                    patrimony,
                    serialNumber,
                    name,
                    caliber: col(row, "CALIBRE", "calibre") ?? null,
                    manufacturer: col(row, "FABRICANTE", "fabricante") ?? null,
                    finish: col(row, "ACABAMENTO", "acabamento") ?? null,
                    status: "disponivel",
                });
                inserted++;
            } catch {
                skipped++;
            }
        }

        revalidatePath("/dashboard/admin/inventario");
        return { success: true, inserted, skipped, errors };
    } catch (e: unknown) {
        return { success: false, error: (e as Error).message ?? "Erro ao processar." };
    }
}

// ─── COLETES ─────────────────────────────────────────────────

/**
 * Colunas esperadas: PATRIMONIO*, SERIE*, NOME*
 * Opcionais: MODELO, TAMANHO, VALIDADE (DD/MM/AAAA)
 */
export async function importColetes(formData: FormData): Promise<ImportResult> {
    await checkAdmin();
    try {
        const rows = await parseXlsx(formData);
        let inserted = 0, skipped = 0;
        const errors: string[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const patrimony = col(row, "PATRIMONIO", "patrimônio", "patrimonio");
            const serialNumber = col(row, "SERIE", "série", "serie");
            const name = col(row, "NOME", "nome", "DESCRIÇÃO", "descricao");

            if (!patrimony || !serialNumber || !name) {
                errors.push(`Linha ${i + 2}: Campos obrigatórios ausentes (PATRIMONIO, SERIE, NOME).`);
                continue;
            }

            try {
                await db.insert(coletes).values({
                    patrimony,
                    serialNumber,
                    name,
                    model: col(row, "MODELO", "modelo") ?? null,
                    size: col(row, "TAMANHO", "tamanho", "TMANHO") ?? null,
                    expiresAt: parseDate(col(row, "VALIDADE", "validade")),
                    status: "disponivel",
                });
                inserted++;
            } catch {
                skipped++;
            }
        }

        revalidatePath("/dashboard/admin/inventario");
        return { success: true, inserted, skipped, errors };
    } catch (e: unknown) {
        return { success: false, error: (e as Error).message ?? "Erro ao processar." };
    }
}

// ─── ALGEMAS ─────────────────────────────────────────────────

/**
 * Colunas esperadas: NOME*
 * Opcionais: PATRIMONIO, SERIE, MARCA, MODELO, QUANTIDADE (para pool sem registro)
 * Se PATRIMONIO estiver preenchido → hasRegistry=true
 */
export async function importAlgemas(formData: FormData): Promise<ImportResult> {
    await checkAdmin();
    try {
        const rows = await parseXlsx(formData);
        let inserted = 0, skipped = 0;
        const errors: string[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const name = col(row, "NOME", "nome", "DESCRIÇÃO");

            if (!name) {
                errors.push(`Linha ${i + 2}: Campo obrigatório ausente (NOME).`);
                continue;
            }

            const patrimony = col(row, "PATRIMONIO", "patrimônio") ?? "0008";
            const serialNumber = col(row, "SERIE", "série") ?? "0009";
            const hasRegistry = patrimony !== "0008" && serialNumber !== "0009";
            const qty = parseInt(col(row, "QUANTIDADE", "quantidade") ?? "1") || 1;

            try {
                await db.insert(algemas).values({
                    name,
                    patrimony,
                    serialNumber,
                    brand: col(row, "MARCA", "marca") ?? null,
                    model: col(row, "MODELO", "modelo") ?? null,
                    hasRegistry,
                    totalQty: hasRegistry ? 1 : qty,
                    availableQty: hasRegistry ? 1 : qty,
                    status: "disponivel",
                });
                inserted++;
            } catch {
                skipped++;
            }
        }

        revalidatePath("/dashboard/admin/inventario");
        return { success: true, inserted, skipped, errors };
    } catch (e: unknown) {
        return { success: false, error: (e as Error).message ?? "Erro ao processar." };
    }
}

// ─── MUNIÇÕES ────────────────────────────────────────────────

/**
 * Colunas esperadas: LOTE*, DESCRICAO*, TIPO*, QUANTIDADE*
 * Opcionais: VALIDADE (DD/MM/AAAA)
 */
export async function importMunicoes(formData: FormData): Promise<ImportResult> {
    await checkAdmin();
    try {
        const rows = await parseXlsx(formData);
        let inserted = 0, skipped = 0;
        const errors: string[] = [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const batch = col(row, "LOTE", "lote");
            const description = col(row, "DESCRICAO", "DESCRIÇÃO", "descricao", "descrição");
            const type = col(row, "TIPO", "tipo", "CALIBRE", "calibre");
            const qtyStr = col(row, "QUANTIDADE", "quantidade", "QTD", "qtd");
            const qty = parseInt(qtyStr ?? "0") || 0;

            if (!batch || !description || !type || qty <= 0) {
                errors.push(`Linha ${i + 2}: Campos obrigatórios ausentes (LOTE, DESCRICAO, TIPO, QUANTIDADE > 0).`);
                continue;
            }

            try {
                await db.insert(municoes).values({
                    batch,
                    description,
                    type,
                    totalQty: qty,
                    availableQty: qty,
                    expiresAt: parseDate(col(row, "VALIDADE", "validade")),
                });
                inserted++;
            } catch {
                skipped++;
            }
        }

        revalidatePath("/dashboard/admin/inventario");
        return { success: true, inserted, skipped, errors };
    } catch (e: unknown) {
        return { success: false, error: (e as Error).message ?? "Erro ao processar." };
    }
}

// ─── EQUIPAMENTOS (legado) ────────────────────────────────────

export async function processBulkImport(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { success: false, error: "Nenhum arquivo enviado." };

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        let count = 0;
        for (const row of jsonData as Array<Record<string, unknown>>) {
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

// ─── TEMPLATE GENERATOR ───────────────────────────────────────

export async function downloadTemplate(type: "armas" | "coletes" | "algemas" | "municoes") {
    const templates: Record<string, string[][]> = {
        armas: [
            ["PATRIMONIO", "SERIE", "NOME", "CALIBRE", "FABRICANTE", "ACABAMENTO"],
            ["00001", "AB12345", "Pistola Taurus G2C", "9mm", "Taurus", "Fosco"],
        ],
        coletes: [
            ["PATRIMONIO", "SERIE", "NOME", "MODELO", "TAMANHO", "VALIDADE"],
            ["00001", "C98765", "Colete Balístico", "IIIA", "G", "31/12/2028"],
        ],
        algemas: [
            ["NOME", "PATRIMONIO", "SERIE", "MARCA", "MODELO", "QUANTIDADE"],
            ["Algema Individual", "00001", "AL001", "Hiatts", "Speedcuff", "1"],
            ["Algema Pool (sem registro)", "", "", "Genérica", "", "50"],
        ],
        municoes: [
            ["LOTE", "DESCRICAO", "TIPO", "QUANTIDADE", "VALIDADE"],
            ["L2024-001", "Munição 9mm CBC", "9mm", "500", "31/12/2027"],
        ],
    };

    const ws = XLSX.utils.aoa_to_sheet(templates[type]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type);
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    return Buffer.from(buf).toString("base64");
}

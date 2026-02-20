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

/**
 * Normalizes a row's keys (trim + lowercase) once so that
 * column lookups are immune to leading/trailing spaces and case.
 */
function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(row)) {
        out[k.trim().toLowerCase()] = row[k];
    }
    return out;
}

/**
 * Looks up a value by any of the provided key aliases (all lowercased).
 * Row must already be normalized via normalizeRow().
 */
function col(row: Record<string, unknown>, ...keys: string[]): string | undefined {
    for (const k of keys) {
        const v = row[k.trim().toLowerCase()];
        if (v != null && String(v).trim() !== "") return String(v).trim();
    }
    return undefined;
}

/**
 * Like col(), but also removes ALL internal whitespace.
 * Use for identifier fields (patrimônio, série) where spaces are never meaningful.
 * e.g. "208011988-K " → "208011988-K", "SAY 16272" → "SAY16272"
 */
function colId(row: Record<string, unknown>, ...keys: string[]): string | undefined {
    const v = col(row, ...keys);
    return v ? v.replace(/\s+/g, "") : undefined;
}


function parseDate(val: string | undefined): Date | null {
    if (!val) return null;
    // Supports DD/MM/AAAA or AAAA-MM-DD or Excel serial numbers
    if (/^\d+$/.test(val)) {
        // Excel serial date
        return new Date((parseInt(val) - 25569) * 86400 * 1000);
    }
    if (val.includes("/")) {
        const parts = val.split("/");
        if (parts.length === 3) {
            const [d, m, y] = parts;
            return new Date(`${y.trim()}-${m.trim().padStart(2, "0")}-${d.trim().padStart(2, "0")}`);
        }
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

async function parseXlsx(formData: FormData): Promise<Array<Record<string, unknown>>> {
    const file = formData.get("file") as File;
    if (!file) throw new Error("Nenhum arquivo enviado.");
    const bytes = await file.arrayBuffer();
    const wb = XLSX.read(Buffer.from(bytes), { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(ws) as Array<Record<string, unknown>>;
    // Normalize all keys up front so col() always works
    return raw.map(normalizeRow);
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
            // Real aliases from BD_ARMA.xlsx: "Patrimônio ", " Série    ", "Nome do Material  "
            // colId() removes ALL internal whitespace from identifiers automatically
            const patrimony = colId(row,
                "patrimônio", "patrimonio", "patrimônio:",
                "pat.", "pat", "patrimonio."
            );
            const serialNumber = colId(row,
                "série", "serie", "n° série", "n° serie",
                "número de série", "numero de serie", "nro serie"
            );
            const name = col(row,
                "nome do material", "nome", "descrição",
                "descricao", "material", "denominação"
            );

            if (!patrimony || !serialNumber || !name) {
                errors.push(`Linha ${i + 2}: Campos obrigatórios ausentes (Patrimônio, Série, Nome do Material).`);
                continue;
            }

            try {
                await db.insert(armas).values({
                    patrimony,
                    serialNumber,
                    name,
                    // BD_ARMA.xlsx: "Tiros Cal " for caliber, "Acabamento " for finish, "Fabricante" for manufacturer
                    caliber: col(row, "tiros cal", "calibre", "caliber", "cal") ?? null,
                    manufacturer: col(row, "fabricante", "manufacturer") ?? null,
                    finish: col(row, "acabamento", "finish") ?? null,
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
            // Real aliases from BD_COLETE.xlsx: "PATRIMONIO", "N° Serie", "COLETE BALÍSTICO"
            // colId() cleans all spaces from identifiers
            const patrimony = colId(row,
                "patrimonio", "patrimônio", "pat."
            );
            const serialNumber = colId(row,
                "n° serie", "n° série", "serie", "série",
                "numero de serie", "número de série", "nro serie"
            );
            const name = col(row,
                "colete balístico", "colete balistico", "nome do material",
                "nome", "descrição", "descricao", "material"
            );

            if (!patrimony || !serialNumber || !name) {
                errors.push(`Linha ${i + 2}: Campos obrigatórios ausentes (PATRIMONIO, Série, Nome).`);
                continue;
            }

            try {
                await db.insert(coletes).values({
                    patrimony,
                    serialNumber,
                    name,
                    model: col(row, "modelo", "model") ?? null,
                    // BD_COLETE.xlsx: "TAMANHO" and "Vencimento" for expiry
                    size: col(row, "tamanho", "tmanho", "size") ?? null,
                    expiresAt: parseDate(col(row, "vencimento", "validade", "expiry", "expires")),
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
            // Real aliases from BD_ALGEMA.xlsx: "Patrimônio ", "Série", "Nome do Material  "
            const name = col(row,
                "nome do material", "nome", "descrição", "descricao", "material"
            );

            if (!name) {
                errors.push(`Linha ${i + 2}: Campo obrigatório ausente (Nome do Material).`);
                continue;
            }

            const patrimony = colId(row, "patrimônio", "patrimonio", "pat.") ?? "0008";
            const serialNumber = colId(row, "série", "serie", "n° serie", "n° série") ?? "0009";
            const hasRegistry = patrimony !== "0008" && serialNumber !== "0009";
            const qty = parseInt(col(row, "quantidade", "qtd", "uso") ?? "1") || 1;

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
            // Real aliases from BD_MUNIÇAO.xlsx: "LOTE", "DESCRIÇÃO", "USO" (qty), "TIPO", "Validade"
            const batch = col(row, "lote");
            const description = col(row, "descrição", "descricao", "descri\u00e7\u00e3o", "nome", "material");
            const type = col(row, "tipo", "calibre", "cal");
            // BD_MUNIÇAO.xlsx uses "USO" for quantity
            const qtyStr = col(row, "uso", "quantidade", "qtd", "qty");
            const qty = parseInt(qtyStr ?? "0") || 0;

            if (!batch || !description || !type) {
                errors.push(`Linha ${i + 2}: Campos obrigatórios ausentes (LOTE, DESCRIÇÃO, TIPO).`);
                continue;
            }

            if (qty <= 0) {
                errors.push(`Linha ${i + 2}: Lote "${batch}" sem quantidade válida (USO/QUANTIDADE = ${qtyStr ?? "vazio"}).`);
                continue;
            }

            try {
                await db.insert(municoes).values({
                    batch,
                    description,
                    type,
                    totalQty: qty,
                    availableQty: qty,
                    expiresAt: parseDate(col(row, "validade", "vencimento", "expiry")),
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

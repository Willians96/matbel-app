import type { TransferHistoryItem } from "@/server/queries/history";

export async function gerarTermoCarga(item: TransferHistoryItem) {
    // Dynamic import so jsPDF is never bundled server-side
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    const contentWidth = W - margin * 2;

    // ─── COLORS ──────────────────────────────────────────────────────────────
    const pmBlue = "#002147";
    const lightGray = "#F8FAFC";
    const borderGray = "#CBD5E1";

    // ─── HEADER BAND ─────────────────────────────────────────────────────────
    doc.setFillColor(pmBlue);
    doc.rect(0, 0, W, 38, "F");

    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("POLÍCIA MILITAR DO ESTADO DE SÃO PAULO", W / 2, 13, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Controle de Material Bélico — CPI-7", W / 2, 21, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const tipoTermo = item.type === "allocation" ? "TERMO DE CARGA / ALOCAÇÃO" : "TERMO DE DEVOLUÇÃO";
    doc.text(tipoTermo, W / 2, 32, { align: "center" });

    // ─── METADATA LINE ───────────────────────────────────────────────────────
    doc.setTextColor("#000000");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const dateStr = item.timestamp
        ? new Date(item.timestamp).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        })
        : "-";
    doc.text(`Data/Hora: ${dateStr}`, margin, 46);
    doc.text(`Protocolo: ${item.id.slice(0, 8).toUpperCase()}`, W - margin, 46, { align: "right" });

    // ─── SEPARATOR ───────────────────────────────────────────────────────────
    doc.setDrawColor(borderGray);
    doc.setLineWidth(0.3);
    doc.line(margin, 49, W - margin, 49);

    // ─── SECTION HELPER ──────────────────────────────────────────────────────
    let curY = 55;

    function sectionTitle(title: string) {
        doc.setFillColor(lightGray);
        doc.roundedRect(margin, curY - 4, contentWidth, 8, 1, 1, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(pmBlue);
        doc.text(title.toUpperCase(), margin + 3, curY + 1);
        curY += 8;
    }

    function row(label: string, value: string, col: "left" | "right" = "left") {
        const xLabel = col === "left" ? margin + 2 : W / 2 + 2;
        const xValue = col === "left" ? margin + 42 : W / 2 + 42;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor("#475569");
        doc.text(label, xLabel, curY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor("#0F172A");
        doc.text(value || "—", xValue, curY);
    }

    // ─── POLICIAL ────────────────────────────────────────────────────────────
    sectionTitle("Dados do Policial");
    curY += 5;
    row("Nome:", item.user.name);
    row("RE:", item.user.re ?? "N/A", "right");
    curY += 6;
    row("Posto/Graduação:", item.user.rank ?? "—");
    row("Unidade:", item.user.unit ?? "—", "right");
    curY += 10;

    // ─── EQUIPAMENTO ─────────────────────────────────────────────────────────
    sectionTitle("Dados do Equipamento");
    curY += 5;
    row("Descrição:", item.equipment.name);
    row("Nº Serial:", item.equipment.serialNumber, "right");
    curY += 6;
    row("Patrimônio:", item.equipment.patrimony ?? "—");
    row("Status:", item.status === "confirmed" ? "Confirmado" : item.status, "right");
    curY += 10;

    // ─── DECLARATION TEXT ────────────────────────────────────────────────────
    sectionTitle("Declaração");
    curY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#0F172A");

    const declarationText = item.type === "allocation"
        ? `Eu, ${item.user.rank ?? ""} ${item.user.name}, RE ${item.user.re ?? "N/A"}, declaro ter recebido em perfeito estado o material acima descrito, comprometendo-me com a sua guarda, conservação e uso adequado, respondendo pessoalmente por qualquer avaria ou extravio.`
        : `Eu, ${item.user.rank ?? ""} ${item.user.name}, RE ${item.user.re ?? "N/A"}, declaro ter devolvido o material acima descrito à administração da unidade, em conformidade com o procedimento estabelecido.`;

    const lines = doc.splitTextToSize(declarationText, contentWidth - 6);
    doc.text(lines, margin + 3, curY);
    curY += lines.length * 5 + 12;

    // ─── SIGNATURES ──────────────────────────────────────────────────────────
    doc.setDrawColor(borderGray);
    doc.setLineWidth(0.4);

    // Left sig
    const sigW = (contentWidth - 20) / 2;
    doc.line(margin, curY, margin + sigW, curY);
    curY += 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor("#475569");
    doc.text(`${item.user.rank ?? "Policial"} ${item.user.name}`, margin + sigW / 2, curY, { align: "center" });
    curY += 4;
    doc.setFont("helvetica", "normal");
    doc.text(`RE: ${item.user.re ?? "N/A"}`, margin + sigW / 2, curY, { align: "center" });

    // Right sig
    const sigX2 = W - margin - sigW;
    const sigY = curY - 9;
    doc.line(sigX2, sigY, W - margin, sigY);
    doc.setFont("helvetica", "bold");
    doc.text("Responsável pela Seção", sigX2 + sigW / 2, sigY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text("Administração CPI-7", sigX2 + sigW / 2, sigY + 9, { align: "center" });

    curY += 16;

    // ─── DIGITAL HASH ────────────────────────────────────────────────────────
    doc.setFillColor("#F1F5F9");
    doc.rect(margin, curY, contentWidth, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#64748B");
    doc.text(
        `Documento gerado eletronicamente • ID: ${item.id} • ${new Date().toISOString()}`,
        W / 2, curY + 6,
        { align: "center" }
    );

    // ─── FOOTER ──────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor("#94A3B8");
    doc.text("© 2026 PMESP — Sistema de Controle de Material Bélico — CPI-7", W / 2, 290, { align: "center" });

    // ─── SAVE ─────────────────────────────────────────────────────────────────
    const nomeArquivo = `termo-${item.type === "allocation" ? "carga" : "devolucao"}-${item.user.re ?? "re"}-${item.id.slice(0, 6)}.pdf`;
    doc.save(nomeArquivo);
}

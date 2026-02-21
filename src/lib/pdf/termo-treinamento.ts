export async function gerarTermoTreinamento(data: {
    header: any;
    instutor: any;
    admin: any;
    munic: any;
    itens: any[];
}) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210;
    const margin = 20;
    const contentWidth = W - margin * 2;

    const pmBlue = "#002147";
    const lightGray = "#F8FAFC";
    const borderGray = "#CBD5E1";

    // ─── HEADER ──────────────────────────────────────────────────────────────
    doc.setFillColor(pmBlue);
    doc.rect(0, 0, W, 38, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("POLÍCIA MILITAR DO ESTADO DE SÃO PAULO", W / 2, 13, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Controle de Material Bélico — CPI-7", W / 2, 21, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const titulo = data.header.status === "returned" ? "TERMO DE DEVOLUÇÃO - TREINAMENTO" : "RECEBIMENTO DE CARGA - TREINAMENTO";
    doc.text(titulo, W / 2, 32, { align: "center" });

    // ─── METADATA ────────────────────────────────────────────────────────────
    doc.setTextColor("#000000");
    doc.setFontSize(8);
    const dateStr = data.header.createdAt ? new Date(data.header.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "-";
    doc.text(`Data: ${dateStr}`, margin, 46);
    doc.text(`Protocolo: ${data.header.id.slice(0, 8).toUpperCase()}`, W - margin, 46, { align: "right" });

    doc.setDrawColor(borderGray);
    doc.line(margin, 49, W - margin, 49);

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
        const xValue = col === "left" ? margin + 35 : W / 2 + 35;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor("#475569");
        doc.text(label, xLabel, curY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor("#0F172A");
        doc.text(value || "—", xValue, curY);
    }

    // ─── PARTES ──────────────────────────────────────────────────────────────
    sectionTitle("Partes Envolvidas");
    curY += 5;
    row("Instrutor:", data.instutor?.name || "—");
    row("RE:", data.instutor?.re || "—", "right");
    curY += 6;
    row("Responsável:", data.admin?.name || "—");
    row("Status:", data.header.status === 'confirmed' ? 'Em Treino' : 'Finalizado', "right");
    curY += 10;

    // ─── EQUIPAMENTOS ────────────────────────────────────────────────────────
    sectionTitle("Equipamentos e Armas");
    curY += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Item", margin + 2, curY);
    doc.text("Patrimônio", margin + 70, curY);
    doc.text("Nº Série", margin + 120, curY);
    curY += 4;
    doc.line(margin, curY, W - margin, curY);
    curY += 6;

    doc.setFont("helvetica", "normal");
    for (const item of data.itens) {
        doc.text(item.detail.name || "—", margin + 2, curY);
        doc.text(item.detail.patrimony || "—", margin + 70, curY);
        doc.text(item.detail.serialNumber || "—", margin + 120, curY);
        curY += 6;
        if (curY > 260) { doc.addPage(); curY = 20; }
    }
    curY += 4;

    // ─── MUNIÇÃO ─────────────────────────────────────────────────────────────
    if (data.header.municaoQty > 0) {
        sectionTitle("Munição de Treino");
        curY += 6;
        row("Descrição:", data.munic?.description || "—");
        row("Lote:", data.munic?.batch || "—", "right");
        curY += 6;
        row("Qtd. Entregue:", `${data.header.municaoQty} unidades`);
        if (data.header.status === "returned") {
            row("Cápsulas Devolvidas:", `${data.header.capsulesQty} unidades`, "right");
        }
        curY += 10;
    }

    // ─── DECLARAÇÃO ──────────────────────────────────────────────────────────
    sectionTitle("Declaração");
    curY += 6;
    doc.setFontSize(8);
    const declText = data.header.status === "returned"
        ? `Confirmo a devolução de todo o material bélico listado acima, bem como as cápsulas das munições deflagradas em treinamento.`
        : `Declaro ter recebido em perfeito estado o material acima descrito para fins de instrução/treinamento, assumindo total responsabilidade pela sua guarda e conservação.`;
    const lines = doc.splitTextToSize(declText, contentWidth - 6);
    doc.text(lines, margin + 3, curY);
    curY += lines.length * 5 + 15;

    // ─── ASSINATURAS ─────────────────────────────────────────────────────────
    const sigW = (contentWidth - 20) / 2;
    doc.line(margin, curY, margin + sigW, curY);
    doc.line(W - margin - sigW, curY, W - margin, curY);
    curY += 5;
    doc.setFont("helvetica", "bold");
    doc.text(data.instutor?.name || "Instrutor", margin + sigW / 2, curY, { align: "center" });
    doc.text("Administração/Reserva", W - margin - sigW / 2, curY, { align: "center" });

    // ─── FOOTER ──────────────────────────────────────────────────────────────
    doc.setFontSize(7);
    doc.setTextColor("#94A3B8");
    doc.text(`Hash Digital: ${data.header.signature || "Aguardando aceite"}`, W / 2, 285, { align: "center" });
    doc.text("Documento gerado pelo Sistema de Controle de Material Bélico - CPI-7", W / 2, 290, { align: "center" });

    const fileName = `treinamento-${data.header.status}-${data.instutor?.re || "res"}.pdf`;
    doc.save(fileName);
}

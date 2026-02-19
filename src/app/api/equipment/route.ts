import { NextResponse } from "next/server";
import { getEquipments } from "@/server/queries/equipment";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "10");
    const filters: any = {};
    const serialNumber = url.searchParams.get("serialNumber");
    const patrimony = url.searchParams.get("patrimony");
    const unit = url.searchParams.get("unit");
    const status = url.searchParams.get("status");
    if (serialNumber) filters.serialNumber = serialNumber;
    if (patrimony) filters.patrimony = patrimony;
    if (unit) filters.unit = unit;
    if (status) filters.status = status;

    const result = await getEquipments(filters, page, pageSize);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}


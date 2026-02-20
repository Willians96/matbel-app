import { redirect } from "next/navigation";

// Unidades foi movido para Configurações → /dashboard/settings
export default function UnitsPage() {
    redirect("/dashboard/settings");
}

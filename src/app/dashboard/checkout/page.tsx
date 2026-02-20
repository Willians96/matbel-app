
import { checkAdmin } from "@/server/auth";
import { CheckoutForm } from "@/components/dashboard/checkout-form";
import { ShieldCheck } from "lucide-react";

export default async function CheckoutPage() {
    await checkAdmin();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-pm-blue text-white rounded-full">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-pm-blue">Retirada de Material</h2>
                    <p className="text-muted-foreground">
                        Registro de retirada de armamento e equipamentos.
                    </p>
                </div>
            </div>

            <CheckoutForm />
        </div>
    );
}

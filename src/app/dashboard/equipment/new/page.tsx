
import { EquipmentForm } from "@/components/forms/equipment-form";

export default function NewEquipmentPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Cadastrar Novo Equipamento</h3>
                <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo para adicionar um item ao inventário.
                </p>
            </div>
            <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
                <EquipmentForm />
            </div>
        </div>
    );
}

import { UNIDADES_PM } from "@/config/units";
import { z } from "zod";

export const equipmentSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    serialNumber: z.string().min(1, {
        message: "O número de série é obrigatório.",
    }),
    patrimony: z.string().optional(),
    category: z.string().min(1, {
        message: "A categoria é obrigatória.",
    }),
    unit: z.enum(UNIDADES_PM as unknown as [string, ...string[]]),
    status: z.enum(["disponivel", "em_uso", "manutencao", "baixado"] as const),
    observations: z.string().optional(),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>

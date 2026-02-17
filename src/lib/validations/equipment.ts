
import { z } from "zod"

export const equipmentSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    serialNumber: z.string().min(1, {
        message: "O número de série é obrigatório.",
    }),
    category: z.string().min(1, {
        message: "A categoria é obrigatória.",
    }),
    status: z.enum(["disponivel", "em_uso", "manutencao", "baixado"], {
        required_error: "Selecione um status.",
    }),
    observations: z.string().optional(),
})

export type EquipmentFormValues = z.infer<typeof equipmentSchema>

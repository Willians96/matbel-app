
import { z } from "zod";

export const declarationSchema = z.object({
    gunSerialNumber: z.string().optional(),
    vestSerialNumber: z.string().optional(),
    hasHandcuffs: z.boolean().default(false),
    handcuffsSerialNumber: z.string().optional(),
}).refine((data) => {
    // If hasHandcuffs is true, handcuffsSerialNumber is required
    if (data.hasHandcuffs && (!data.handcuffsSerialNumber || data.handcuffsSerialNumber.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Informe o serial da algema ou desmarque a opção.",
    path: ["handcuffsSerialNumber"],
});

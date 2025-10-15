import { z } from 'zod'

export const TreatmentItemSchema = z.object({
  notes: z.string().optional().or(z.literal('')),
  product_id: z.string().nonempty('El producto es requerido'),
  qty: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  treatment_id: z.string().nonempty('El tratamiento es requerido'),
  unit_price: z
    .number()
    .min(0, 'El precio unitario debe ser mayor o igual a 0'),
})

export type TreatmentItemFormData = z.infer<typeof TreatmentItemSchema>

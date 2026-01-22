import { z } from 'zod'

export const MedicalRecordItemSchema = z.object({
  notes: z.string().optional().or(z.literal('')),
  product_id: z.string().nonempty('El producto es requerido'),
  qty: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  record_id: z.string().nonempty('El registro médico es requerido'),
  unit_price: z
    .number()
    .min(0, 'El precio unitario debe ser mayor o igual a 0'),
  discount: z.number().min(0, 'El descuento debe ser mayor o igual a 0').optional(),
})

export type MedicalRecordItemFormData = z.infer<typeof MedicalRecordItemSchema>

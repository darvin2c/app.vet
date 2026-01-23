import { z } from 'zod'

export const VaccinationItemSchema = z.object({
  product_id: z.string().nonempty('El producto es requerido'),
  qty: z.coerce.number().min(1, 'La cantidad debe ser mayor a 0'),
  unit_price: z.coerce.number().optional(),
  product_name: z.string().optional(), // Helper for UI
  discount: z.coerce.number().optional(),
  notes: z.string().optional(),
})

export const VaccinationSchema = z.object({
  clinical_record_id: z.string().nonempty('El registro médico es requerido'),
  product_id: z.string().nonempty('El producto es requerido'),
  dose: z.string().optional(),
  route: z.string().optional(),
  site: z.string().optional(),
  next_due_at: z.string().optional(),
  adverse_event: z.string().optional(),
  items: z.array(VaccinationItemSchema).optional(),
})

export type VaccinationFormData = z.infer<typeof VaccinationSchema>
export type VaccinationItem = z.infer<typeof VaccinationItemSchema>

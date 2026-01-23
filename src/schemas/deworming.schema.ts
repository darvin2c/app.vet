import { z } from 'zod'

export const DewormingSchema = z.object({
  clinical_record_id: z.string().nonempty('El registro médico es requerido'),
  product: z.string().nonempty('El producto es requerido'),
  dose: z.string().optional(),
  route: z.string().optional(),
  next_due_at: z.string().optional(),
  adverse_event: z.string().optional(),
})

export type DewormingFormData = z.infer<typeof DewormingSchema>

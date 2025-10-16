import { z } from 'zod'

export const GroomingSchema = z.object({
  medical_record_id: z.string().nonempty('El registro médico es requerido'),
  service_type: z.string().optional(),
  products_used: z.string().optional(),
  coat_condition: z.string().optional(),
  special_instructions: z.string().optional(),
  before_photos: z.string().optional(),
  after_photos: z.string().optional(),
  groomer_notes: z.string().optional(),
})

export type GroomingFormData = z.infer<typeof GroomingSchema>

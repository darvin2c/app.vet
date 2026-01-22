import { z } from 'zod'

export const VaccinationSchema = z.object({
  clinical_record_id: z.string().nonempty('El registro médico es requerido'),
  dose: z.string().optional(),
  route: z.string().optional(),
  site: z.string().optional(),
  next_due_at: z.string().optional(),
  adverse_event: z.string().optional(),
})

export type VaccinationFormData = z.infer<typeof VaccinationSchema>

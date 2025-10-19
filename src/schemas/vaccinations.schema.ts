import { z } from 'zod'

export const VaccinationSchema = z.object({
  clinical_record_id: z.string().nonempty('El registro médico es requerido'),
  dose: z.string().optional().or(z.literal('')),
  route: z.string().optional().or(z.literal('')),
  site: z.string().optional().or(z.literal('')),
  next_due_at: z.string().optional().or(z.literal('')),
  adverse_event: z.string().optional().or(z.literal('')),
})

export type VaccinationFormData = z.infer<typeof VaccinationSchema>

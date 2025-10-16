import { z } from 'zod'

export const ClinicalNoteSchema = z.object({
  content: z.string().nonempty('El contenido es requerido'),
  treatment_id: z.string().nonempty('El tratamiento es requerido'),
  hospitalization_id: z.string().optional(),
})

export type ClinicalNoteFormData = z.infer<typeof ClinicalNoteSchema>

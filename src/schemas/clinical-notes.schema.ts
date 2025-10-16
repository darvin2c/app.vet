import { z } from 'zod'

export const ClinicalNoteSchema = z.object({
  content: z.string().nonempty('El contenido es requerido'),
  medical_record_id: z.string().nonempty('El registro médico es requerido'),
  hospitalization_id: z.string().optional(),
})

export type ClinicalNoteFormData = z.infer<typeof ClinicalNoteSchema>

import { z } from 'zod'

export const ClinicalNoteSchema = z.object({
  content: z.string().nonempty('El contenido es requerido'),
  clinical_record_id: z.string().nonempty('El registro médico es requerido'),
})

export type ClinicalNoteFormData = z.infer<typeof ClinicalNoteSchema>

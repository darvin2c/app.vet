import { z } from 'zod'

export const ClinicalNoteSchema = z.object({
  note: z.string().nonempty('La nota es requerida'),
  clinical_record_id: z.string().nonempty('El registro médico es requerido'),
  pet_id: z.string().nonempty('La mascota es requerida'),
  vet_id: z.string().optional(),
})

export type ClinicalNoteFormData = z.infer<typeof ClinicalNoteSchema>

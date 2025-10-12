import { z } from 'zod'

export const ClinicalNoteSchema = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  title: z.string().min(1, 'El título es requerido').max(200),
  content: z.string().min(1, 'El contenido es requerido'),
  type: z.enum([
    'consultation',
    'treatment',
    'follow_up',
    'diagnosis',
    'prescription',
    'other',
  ]),
  date: z.date(),
  is_private: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export const CreateClinicalNoteSchema = ClinicalNoteSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdateClinicalNoteSchema = ClinicalNoteSchema.partial().required({
  id: true,
})

export type ClinicalNote = z.infer<typeof ClinicalNoteSchema>
export type CreateClinicalNote = z.infer<typeof CreateClinicalNoteSchema>
export type UpdateClinicalNote = z.infer<typeof UpdateClinicalNoteSchema>

// Schema para filtros de notas clínicas
export const ClinicalNoteFiltersSchema = z.object({
  type: z
    .enum([
      'consultation',
      'treatment',
      'follow_up',
      'diagnosis',
      'prescription',
      'other',
    ])
    .optional(),
  date_from: z.date().optional(),
  date_to: z.date().optional(),
  staff_id: z.string().uuid().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export type ClinicalNoteFilters = z.infer<typeof ClinicalNoteFiltersSchema>

// Tipos de notas clínicas con etiquetas en español
export const CLINICAL_NOTE_TYPES = {
  consultation: 'Consulta',
  treatment: 'Tratamiento',
  follow_up: 'Seguimiento',
  diagnosis: 'Diagnóstico',
  prescription: 'Prescripción',
  other: 'Otro',
} as const

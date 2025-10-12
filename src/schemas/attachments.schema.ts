import { z } from 'zod'

export const AttachmentSchema = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  filename: z.string().min(1, 'El nombre del archivo es requerido'),
  original_filename: z.string().min(1, 'El nombre original es requerido'),
  file_path: z.string().min(1, 'La ruta del archivo es requerida'),
  file_size: z.number().min(1, 'El tamaño del archivo debe ser mayor a 0'),
  mime_type: z.string().min(1, 'El tipo MIME es requerido'),
  category: z.enum([
    'xray',
    'photo',
    'document',
    'consent',
    'prescription',
    'lab_result',
    'other',
  ]),
  description: z.string().optional(),
  date_taken: z.date().optional(),
  is_public: z.boolean().default(false),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export const CreateAttachmentSchema = AttachmentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const UpdateAttachmentSchema = AttachmentSchema.partial().required({
  id: true,
})

export type Attachment = z.infer<typeof AttachmentSchema>
export type CreateAttachment = z.infer<typeof CreateAttachmentSchema>
export type UpdateAttachment = z.infer<typeof UpdateAttachmentSchema>

// Schema para filtros de adjuntos
export const AttachmentFiltersSchema = z.object({
  category: z
    .enum([
      'xray',
      'photo',
      'document',
      'consent',
      'prescription',
      'lab_result',
      'other',
    ])
    .optional(),
  date_from: z.date().optional(),
  date_to: z.date().optional(),
  staff_id: z.string().uuid().optional(),
  search: z.string().optional(),
  mime_type: z.string().optional(),
})

export type AttachmentFilters = z.infer<typeof AttachmentFiltersSchema>

// Categorías de adjuntos con etiquetas en español
export const ATTACHMENT_CATEGORIES = {
  xray: 'Radiografía',
  photo: 'Fotografía',
  document: 'Documento',
  consent: 'Consentimiento',
  prescription: 'Prescripción',
  lab_result: 'Resultado de Laboratorio',
  other: 'Otro',
} as const

// Tipos MIME permitidos
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
] as const

// Tamaño máximo de archivo (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

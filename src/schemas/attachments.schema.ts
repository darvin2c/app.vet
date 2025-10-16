import { z } from 'zod'

// Enum para tipos de archivos permitidos
export const attachmentTypeEnum = z.enum([
  'image',
  'document',
  'video',
  'audio',
  'other',
])

// Enum para categorías de attachments médicos
export const attachmentCategoryEnum = z.enum([
  'xray',
  'ultrasound',
  'blood_test',
  'urine_test',
  'biopsy',
  'vaccination_record',
  'medical_report',
  'prescription',
  'consent_form',
  'insurance_document',
  'other',
])

// Schema base para attachment
export const attachmentBaseSchema = z.object({
  medical_record_id: z.string().nonempty('El registro médico es requerido'),
  file_name: z
    .string()
    .nonempty('El nombre del archivo es requerido')
    .max(255, 'El nombre del archivo no puede exceder 255 caracteres'),
  file_size: z
    .number()
    .min(1, 'El tamaño del archivo debe ser mayor a 0')
    .max(50 * 1024 * 1024, 'El archivo no puede exceder 50MB'), // 50MB máximo
  file_type: z
    .string()
    .nonempty('El tipo de archivo es requerido')
    .regex(/^[a-zA-Z0-9\/\-\+\.]+$/, 'Tipo de archivo inválido'),
  file_url: z
    .string()
    .url('URL del archivo inválida')
    .nonempty('La URL del archivo es requerida'),
  attachment_type: attachmentTypeEnum,
  category: attachmentCategoryEnum.optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string().max(50, 'Cada tag no puede exceder 50 caracteres'))
    .max(10, 'No se pueden agregar más de 10 tags')
    .default([]),
  is_sensitive: z.boolean().default(false), // Para marcar información médica sensible
  uploaded_by: z.string().uuid('ID de usuario inválido').optional(),
})

// Schema para crear attachment
export const createAttachmentSchema = attachmentBaseSchema.omit({
  file_url: true, // Se genera después del upload
})

// Schema para actualizar attachment
export const updateAttachmentSchema = attachmentBaseSchema
  .omit({
    medical_record_id: true,
    file_url: true,
    file_size: true,
    file_type: true,
  })
  .partial()

// Schema para filtros de attachments
export const attachmentFiltersSchema = z.object({
  medical_record_id: z.string().uuid().optional(),
  attachment_type: attachmentTypeEnum.optional(),
  category: attachmentCategoryEnum.optional(),
  is_sensitive: z.boolean().optional(),
  uploaded_by: z.string().uuid().optional(),
  search: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
})

// Schema para upload de archivo
export const attachmentUploadSchema = z.object({
  medical_record_id: z.string().nonempty('El registro médico es requerido'),
  file: z.any().refine((file) => file instanceof File, {
    message: 'Debe seleccionar un archivo válido',
  }),
  attachment_type: attachmentTypeEnum,
  category: attachmentCategoryEnum.optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string().max(50, 'Cada tag no puede exceder 50 caracteres'))
    .max(10, 'No se pueden agregar más de 10 tags'),
  is_sensitive: z.boolean(),
})

// Schema para validar múltiples uploads
export const multipleAttachmentUploadSchema = z.object({
  medical_record_id: z.string().nonempty('El registro médico es requerido'),
  files: z
    .array(
      z.any().refine((file) => file instanceof File, {
        message: 'Debe seleccionar archivos válidos',
      })
    )
    .min(1, 'Debe seleccionar al menos un archivo')
    .max(10, 'No se pueden subir más de 10 archivos a la vez'),
  attachment_type: attachmentTypeEnum,
  category: attachmentCategoryEnum.optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string().max(50, 'Cada tag no puede exceder 50 caracteres'))
    .max(10, 'No se pueden agregar más de 10 tags')
    .default([]),
  is_sensitive: z.boolean().default(false),
})

// Tipos TypeScript derivados de los esquemas
export type AttachmentType = z.infer<typeof attachmentTypeEnum>
export type AttachmentCategory = z.infer<typeof attachmentCategoryEnum>
export type CreateAttachmentSchema = z.infer<typeof createAttachmentSchema>
export type UpdateAttachmentSchema = z.infer<typeof updateAttachmentSchema>
export type AttachmentFilters = z.infer<typeof attachmentFiltersSchema>
export type AttachmentUploadSchema = z.infer<typeof attachmentUploadSchema>
export type MultipleAttachmentUploadSchema = z.infer<
  typeof multipleAttachmentUploadSchema
>

// Tipos para compatibilidad
export type AttachmentSchema = CreateAttachmentSchema
export const AttachmentSchema = createAttachmentSchema
export type AttachmentFormData = CreateAttachmentSchema

// Constantes útiles
export const ALLOWED_FILE_TYPES = {
  image: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  video: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
  audio: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  other: ['*/*'],
} as const

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_FILES_PER_UPLOAD = 10
export const MAX_TAGS_PER_ATTACHMENT = 10

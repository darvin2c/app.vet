import { z } from 'zod'

// Esquema base para tipos de cita - basado en la tabla appointment_types de Supabase
export const appointmentBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre del tipo de cita es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'El color debe ser un código hexadecimal válido (#ffffff)'
    ),
  is_active: z.boolean().default(true),
})

// Esquema para crear tipo de cita
export const appointmentTypeCreateSchema = appointmentBaseSchema

// Esquema para actualizar tipo de cita
export const appointmentTypeUpdateSchema = appointmentBaseSchema.partial()

export const appointmentTypeImportSchema = appointmentBaseSchema.extend({
  is_active: z.coerce.boolean().default(true),
})

// Tipos derivados
export type AppointmentTypeCreateSchema = z.infer<
  typeof appointmentTypeCreateSchema
>
export type AppointmentTypeUpdateSchema = z.infer<
  typeof appointmentTypeUpdateSchema
>

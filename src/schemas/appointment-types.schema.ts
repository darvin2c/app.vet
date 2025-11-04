import { z } from 'zod'

// Esquema base para tipos de cita - basado en la tabla appointment_types de Supabase
export const appointmentBaseSchema = z.object({
  name: z
    .string()
    .nonempty('El nombre del tipo de cita es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  code: z
    .string()
    .max(50, 'El código no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  duration_minutes: z
    .number()
    .min(1, 'La duración debe ser mayor a 0')
    .max(480, 'La duración no puede exceder 480 minutos (8 horas)'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'El color debe ser un código hexadecimal válido (#ffffff)'
    ),
  is_active: z.boolean().default(true),
})

// Esquema para crear tipo de cita
export const createAppointmentTypeSchema = appointmentBaseSchema

// Esquema para actualizar tipo de cita
export const updateAppointmentTypeSchema = appointmentBaseSchema
  .partial()
  .extend({
    is_active: z.boolean().optional(),
  })

// Esquema para filtros de tipos de citas
export const appointmentTypeFiltersSchema = z.object({
  search: z.string().optional(),
  is_active: z.boolean().optional(),
})

// Tipos derivados
export type AppointmentTypeCreate = z.infer<typeof createAppointmentTypeSchema>
export type AppointmentTypeUpdate = z.infer<typeof updateAppointmentTypeSchema>
export type AppointmentTypeFilters = z.infer<
  typeof appointmentTypeFiltersSchema
>

// Tipos para compatibilidad
export type CreateAppointmentTypeSchema = AppointmentTypeCreate
export type UpdateAppointmentTypeSchema = AppointmentTypeUpdate
export const AppointmentTypeSchema = createAppointmentTypeSchema

import { z } from 'zod'

// Schema para crear un tipo de cita
export const createAppointmentTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es muy largo'),
  description: z.string().optional(),
  duration_minutes: z.number().min(1, 'La duración debe ser mayor a 0'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'El color debe ser un código hexadecimal válido (#ffffff)'
    ),
  is_active: z.boolean(),
})

// Schema para actualizar un tipo de cita
export const updateAppointmentTypeSchema = createAppointmentTypeSchema.partial()

// Schema para filtros de tipos de citas
export const appointmentTypeFiltersSchema = z.object({
  is_active: z.boolean().optional(),
  search: z.string().optional(),
})

export type CreateAppointmentTypeSchema = z.infer<
  typeof createAppointmentTypeSchema
>
export type UpdateAppointmentTypeSchema = z.infer<
  typeof updateAppointmentTypeSchema
>
export type AppointmentTypeFiltersSchema = z.infer<
  typeof appointmentTypeFiltersSchema
>

// Alias para compatibilidad
export type AppointmentTypeSchema = CreateAppointmentTypeSchema
export const appointmentTypeSchema = createAppointmentTypeSchema

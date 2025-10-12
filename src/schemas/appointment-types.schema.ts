import { z } from 'zod'

// Schema para crear un tipo de cita
export const createAppointmentTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es muy largo'),
  code: z
    .string()
    .max(50, 'El código es muy largo')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'El color debe ser un código hexadecimal válido (#ffffff)'
    )
    .optional()
    .default('#3b82f6'),
  active: z.boolean().optional().default(true),
})

// Schema para actualizar un tipo de cita
export const updateAppointmentTypeSchema = z.object({
  id: z.string().uuid('ID de tipo de cita inválido'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es muy largo')
    .optional(),
  code: z
    .string()
    .max(50, 'El código es muy largo')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'El color debe ser un código hexadecimal válido (#ffffff)'
    )
    .optional(),
  active: z.boolean().optional(),
})

// Schema para filtros de tipos de citas
export const appointmentTypeFiltersSchema = z.object({
  active: z.boolean().optional(),
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

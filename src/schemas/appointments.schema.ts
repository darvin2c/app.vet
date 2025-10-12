import { z } from 'zod'

// Enum para estados de citas
export const appointmentStatusEnum = z.enum([
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
])

export type AppointmentStatus = z.infer<typeof appointmentStatusEnum>

// Schema para crear una cita
export const createAppointmentSchema = z
  .object({
    pet_id: z.string().uuid('ID de mascota inválido'),
    veterinarian_id: z.string().uuid('ID de veterinario inválido').optional(),
    appointment_type_id: z.string().uuid('ID de tipo de cita inválido'),
    scheduled_start: z.string().refine((val) => {
      if (!val) return false
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha y hora de inicio inválida'),
    scheduled_end: z.string().refine((val) => {
      if (!val) return false
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha y hora de fin inválida'),
    status: appointmentStatusEnum.optional().default('scheduled'),
    reason: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.scheduled_end) > new Date(data.scheduled_start),
    {
      message: 'La hora de fin debe ser posterior a la hora de inicio',
      path: ['scheduled_end'],
    }
  )

// Schema para actualizar una cita
export const updateAppointmentSchema = createAppointmentSchema
  .partial()
  .extend({
    id: z.string().uuid('ID de cita inválido'),
  })

// Schema para filtros de citas
export const appointmentFiltersSchema = z.object({
  pet_id: z.string().uuid().optional(),
  veterinarian_id: z.string().uuid().optional(),
  appointment_type_id: z.string().uuid().optional(),
  status: appointmentStatusEnum.optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  search: z.string().optional(),
})

// Schema para validar conflictos de horarios
export const appointmentConflictSchema = z.object({
  veterinarian_id: z.string().uuid().optional(),
  scheduled_start: z.string().datetime(),
  scheduled_end: z.string().datetime(),
  exclude_appointment_id: z.string().uuid().optional(),
})

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>
export type AppointmentFiltersSchema = z.infer<typeof appointmentFiltersSchema>
export type AppointmentConflictSchema = z.infer<
  typeof appointmentConflictSchema
>

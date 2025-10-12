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
    patient_id: z.string().uuid('ID de paciente inválido'),
    staff_id: z.string().uuid('ID de staff inválido').optional(),
    procedure_id: z.string().uuid('ID de procedimiento inválido').optional(),
    appointment_type_id: z.string().uuid('ID de tipo de cita inválido'),
    start_time: z.string().refine((val) => {
      if (!val) return false
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha y hora de inicio inválida'),
    end_time: z.string().refine((val) => {
      if (!val) return false
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha y hora de fin inválida'),
    status: appointmentStatusEnum.optional().default('scheduled'),
    notes: z.string().optional(),
  })
  .refine((data) => new Date(data.end_time) > new Date(data.start_time), {
    message: 'La hora de fin debe ser posterior a la hora de inicio',
    path: ['end_time'],
  })

// Schema para actualizar una cita
export const updateAppointmentSchema = createAppointmentSchema
  .partial()
  .extend({
    id: z.string().uuid('ID de cita inválido'),
  })

// Schema para filtros de citas
export const appointmentFiltersSchema = z.object({
  patient_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional(),
  appointment_type_id: z.string().uuid().optional(),
  status: appointmentStatusEnum.optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  search: z.string().optional(),
})

// Schema para validar conflictos de horarios
export const appointmentConflictSchema = z.object({
  staff_id: z.string().uuid().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  exclude_appointment_id: z.string().uuid().optional(),
})

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>
export type AppointmentFiltersSchema = z.infer<typeof appointmentFiltersSchema>
export type AppointmentConflictSchema = z.infer<
  typeof appointmentConflictSchema
>

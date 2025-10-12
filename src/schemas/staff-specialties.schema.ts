import { z } from 'zod'

// Esquema base para staff_specialties - relación many-to-many
export const staffSpecialtyBaseSchema = z.object({
  staff_id: z.string().uuid('ID de staff inválido'),
  specialty_id: z.string().uuid('ID de especialidad inválido'),
})

// Esquema para crear relación staff-specialty
export const createStaffSpecialtySchema = staffSpecialtyBaseSchema

// Esquema para actualizar relación staff-specialty
export const updateStaffSpecialtySchema = staffSpecialtyBaseSchema.partial()

// Esquema para filtros de staff_specialties
export const staffSpecialtyFiltersSchema = z.object({
  staff_id: z.string().uuid().optional(),
  specialty_id: z.string().uuid().optional(),
  search: z.string().optional(),
})

// Tipos TypeScript derivados
export type StaffSpecialtyBase = z.infer<typeof staffSpecialtyBaseSchema>
export type CreateStaffSpecialtySchema = z.infer<
  typeof createStaffSpecialtySchema
>
export type UpdateStaffSpecialtySchema = z.infer<
  typeof updateStaffSpecialtySchema
>
export type StaffSpecialtyFilters = z.infer<typeof staffSpecialtyFiltersSchema>

// Esquema para asignar múltiples especialidades a un staff
export const assignSpecialtiesToStaffSchema = z.object({
  staff_id: z.string().uuid('ID de staff inválido'),
  specialty_ids: z
    .array(z.string().uuid('ID de especialidad inválido'))
    .min(1, 'Debe seleccionar al menos una especialidad')
    .max(10, 'No se pueden asignar más de 10 especialidades'),
})

export type AssignSpecialtiesToStaffSchema = z.infer<
  typeof assignSpecialtiesToStaffSchema
>

// Esquema para asignar múltiples staff a una especialidad
export const assignStaffToSpecialtySchema = z.object({
  specialty_id: z.string().uuid('ID de especialidad inválido'),
  staff_ids: z
    .array(z.string().uuid('ID de staff inválido'))
    .min(1, 'Debe seleccionar al menos un miembro del staff')
    .max(50, 'No se pueden asignar más de 50 miembros del staff'),
})

export type AssignStaffToSpecialtySchema = z.infer<
  typeof assignStaffToSpecialtySchema
>

import { z } from 'zod'

export const createRoleSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().optional().or(z.literal('')),
  perms: z.array(z.string()).min(1, 'Debe seleccionar al menos un permiso'),
})

export const updateRoleSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  description: z.string().optional().or(z.literal('')),
  perms: z.array(z.string()).min(1, 'Debe seleccionar al menos un permiso'),
})

export const CreateRoleSchema = createRoleSchema
export const UpdateRoleSchema = updateRoleSchema

export type CreateRoleSchema = z.infer<typeof createRoleSchema>
export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>

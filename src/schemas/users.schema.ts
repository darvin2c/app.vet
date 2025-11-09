import { z } from 'zod'

// Schema para actualizar roles de un usuario
export const updateUserRolesSchema = z.object({
  role_ids: z.array(z.string()).min(0, 'Debe seleccionar al menos un rol'),
})

// Schema para asignar usuario a tenant con rol
export const assignUserToTenantSchema = z.object({
  role_id: z.string().nonempty('Rol es requerido'),
  is_superuser: z.boolean().default(false),
})

// Tipos inferidos
export type UpdateUserRolesSchema = z.infer<typeof updateUserRolesSchema>
export type AssignUserToTenantSchema = z.infer<typeof assignUserToTenantSchema>

import { z } from 'zod'

// Schema para actualizar roles de un usuario
export const updateUserRolesSchema = z.object({
  role_ids: z.array(z.string()).min(0, 'Debe seleccionar al menos un rol'),
})

// Schema para toggle super admin
export const toggleSuperAdminSchema = z.object({
  is_superuser: z.boolean(),
})

// Schema para asignar usuario a tenant con rol
export const assignUserToTenantSchema = z.object({
  user_id: z.string().nonempty('ID de usuario es requerido'),
  role_id: z.string().nonempty('Rol es requerido'),
  is_superuser: z.boolean().default(false),
})

// Tipos inferidos
export type UpdateUserRolesSchema = z.infer<typeof updateUserRolesSchema>
export type ToggleSuperAdminSchema = z.infer<typeof toggleSuperAdminSchema>
export type AssignUserToTenantSchema = z.infer<typeof assignUserToTenantSchema>

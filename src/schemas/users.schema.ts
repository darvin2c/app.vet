import { z } from 'zod'

// Schema para actualizar roles de un usuario
export const updateUserRolesSchema = z.object({
  role_ids: z.array(z.string()).min(0, 'Debe seleccionar al menos un rol'),
})

// Schema para asignar usuario a tenant con rol
export const assignUserToTenantSchema = z
  .object({
    role_id: z.uuid().optional().nullable(),
    is_superuser: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // If superuser is false, role_id is required
      if (!data.is_superuser && !data.role_id) {
        return false
      }
      return true
    },
    {
      message: 'role es requerido cuando is_superuser es falso',
      path: ['role_id'],
    }
  )
// Tipos inferidos
export type UpdateUserRolesSchema = z.infer<typeof updateUserRolesSchema>
export type AssignUserToTenantSchema = z.infer<typeof assignUserToTenantSchema>

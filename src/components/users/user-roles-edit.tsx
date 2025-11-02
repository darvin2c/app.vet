'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserRolesForm } from './user-roles-form'
import {
  updateUserRolesSchema,
  UpdateUserRolesSchema,
} from '@/schemas/users.schema'
import {
  useUserRoleUpdate,
  useUserSuperAdminToggle,
} from '@/hooks/users/use-user-roles-update'
import { Settings } from 'lucide-react'
import { UserWithRole } from '@/hooks/users/use-user-list'

interface UserRolesEditProps {
  user: UserWithRole
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function UserRolesEdit({
  user,
  open,
  onOpenChange,
  trigger,
}: UserRolesEditProps) {
  const updateUserRole = useUserRoleUpdate()
  const toggleSuperAdmin = useUserSuperAdminToggle()

  const form = useForm({
    resolver: zodResolver(updateUserRolesSchema),
    defaultValues: {
      role_ids: user?.role?.id ? [user.role.id] : ['no-role'],
    },
  })

  const onSubmit = async (data: UpdateUserRolesSchema) => {
    try {
      // Actualizar rol del usuario
      if (data.role_ids.length > 0) {
        const roleId = data.role_ids[0]
        // Si se selecciona "no-role", enviar null para remover el rol
        await updateUserRole.mutateAsync({
          userId: user.id,
          roleId: roleId === 'no-role' ? null : roleId,
        })
      }

      if (onOpenChange) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error updating user roles:', error)
    }
  }

  const getFullName = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Sin nombre'
  }

  // Si se proporcionan open y onOpenChange, usar modo controlado
  const drawerProps =
    open !== undefined && onOpenChange !== undefined
      ? { open, onOpenChange }
      : {}

  return (
    <Drawer {...drawerProps}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      {/* Si no hay trigger, usar el botón por defecto solo si no está en modo controlado */}
      {!trigger && open === undefined && (
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent className="!w-full !max-w-md">
        <DrawerHeader>
          <DrawerTitle>Editar Roles de Usuario</DrawerTitle>
          <DrawerDescription>
            Gestiona los roles y permisos de {getFullName(user)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <UserRolesForm user={user} />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateUserRole.isPending}
          >
            {updateUserRole.isPending ? 'Actualizando...' : 'Actualizar Roles'}
          </Button>
          <Button
            variant="outline"
            onClick={() => (onOpenChange ? onOpenChange(false) : undefined)}
            disabled={updateUserRole.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

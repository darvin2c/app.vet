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
import { assignUserToTenantSchema } from '@/schemas/users.schema'
import { useUserRoleUpdate } from '@/hooks/users/use-user-roles-update'
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

  const form = useForm({
    resolver: zodResolver(assignUserToTenantSchema),
    defaultValues: {
      role_id: user?.role?.id || 'no-role',
      is_superuser: user.is_superuser || false,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await updateUserRole.mutateAsync({
      userId: user.id,
      data,
    })
  })

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

      <DrawerContent className="!w-full !max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Editar Roles de Usuario</DrawerTitle>
          <DrawerDescription>
            Gestiona los roles y permisos de {getFullName(user)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <UserRolesForm user={user} />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={onSubmit}
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

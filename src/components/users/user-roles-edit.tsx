'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserRolesForm } from './user-roles-form'
import { assignUserToTenantSchema } from '@/schemas/users.schema'
import { useUserRoleUpdate } from '@/hooks/users/use-user-roles-update'
import { Settings } from 'lucide-react'
import { UserWithRole } from '@/hooks/users/use-user-list'
import { Field } from '../ui/field'

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
    if (onOpenChange) {
      onOpenChange(false)
    }
  })

  const getFullName = (user: UserWithRole) => {
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    return `${firstName} ${lastName}`.trim() || 'Sin nombre'
  }

  // Si se proporcionan open y onOpenChange, usar modo controlado
  const sheetProps =
    open !== undefined && onOpenChange !== undefined
      ? { open, onOpenChange }
      : {}

  return (
    <Sheet {...sheetProps}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}

      {/* Si no hay trigger, usar el botón por defecto solo si no está en modo controlado */}
      {!trigger && open === undefined && (
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </SheetTrigger>
      )}

      <SheetContent side="right" className="!w-full !max-w-xl">
        <SheetHeader>
          <SheetTitle>Editar Roles de Usuario</SheetTitle>
          <SheetDescription>
            Gestiona los roles y permisos de {getFullName(user)}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <UserRolesForm user={user} />
            </form>
          </Form>
        </div>

        <SheetFooter>
          <Field orientation="horizontal">
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={updateUserRole.isPending}
            >
              {updateUserRole.isPending
                ? 'Actualizando...'
                : 'Actualizar Roles'}
            </Button>
            <Button
              variant="outline"
              onClick={() => (onOpenChange ? onOpenChange(false) : undefined)}
              disabled={updateUserRole.isPending}
            >
              Cancelar
            </Button>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

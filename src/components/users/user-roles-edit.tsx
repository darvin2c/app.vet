'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import { UserRolesForm } from './user-roles-form'
import { assignUserToTenantSchema } from '@/schemas/users.schema'
import { useUserRoleUpdate } from '@/hooks/users/use-user-roles-update'
import { Settings } from 'lucide-react'
import { UserWithRole } from '@/hooks/users/use-user-list'
import { Field } from '../ui/field'
import CanAccess from '@/components/ui/can-access'

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
      role_id: user?.role?.id || null,
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
    <CanAccess resource="products" action="update">
      <FormSheet
        open={(sheetProps as any).open}
        onOpenChange={(sheetProps as any).onOpenChange}
        trigger={
          !trigger && open === undefined ? (
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          ) : (
            (trigger as any)
          )
        }
        title="Editar Roles de Usuario"
        description={`Gestiona los roles y permisos de ${getFullName(user)}`}
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateUserRole.isPending}
        submitLabel="Actualizar Roles"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <div className="px-4 overflow-y-auto">
          <UserRolesForm user={user} />
          <Field orientation="horizontal" />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

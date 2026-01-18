'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { RoleForm } from './role-form'
import { UpdateRoleSchema, updateRoleSchema } from '@/schemas/roles.schema'
import { useRoleUpdate } from '@/hooks/roles/use-role-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface RoleEditProps {
  role: Tables<'roles'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleEdit({ role, open, onOpenChange }: RoleEditProps) {
  const updateRole = useRoleUpdate()

  const form = useForm({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: role.name,
      description: role.description || '',
      perms: role.perms || [],
    },
  })

  const onSubmit = async (data: UpdateRoleSchema) => {
    await updateRole.mutateAsync({
      id: role.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Rol"
        description="Modifica la información y permisos del rol."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateRole.isPending}
        submitLabel="Actualizar Rol"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <RoleForm />
      </FormSheet>
    </CanAccess>
  )
}

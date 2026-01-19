'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { RoleForm } from './role-form'
import { CreateRoleSchema, createRoleSchema } from '@/schemas/roles.schema'
import { useRoleCreate } from '@/hooks/roles/use-role-create'
import CanAccess from '@/components/ui/can-access'

interface RoleCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoleCreate({ open, onOpenChange }: RoleCreateProps) {
  const createRole = useRoleCreate()

  const form = useForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      perms: [],
    },
  })

  const onSubmit = async (data: CreateRoleSchema) => {
    await createRole.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <CanAccess resource="roles" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Rol"
        description="Define un nuevo rol y asigna los permisos correspondientes."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createRole.isPending}
        submitLabel="Crear Rol"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <RoleForm />
      </FormSheet>
    </CanAccess>
  )
}

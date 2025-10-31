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
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { RoleForm } from './role-form'
import { UpdateRoleSchema, updateRoleSchema } from '@/schemas/roles.schema'
import { useRoleUpdate } from '@/hooks/roles/use-role-update'
import { Tables } from '@/types/supabase.types'

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Rol</DrawerTitle>
          <DrawerDescription>
            Modifica la información y permisos del rol.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <RoleForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateRole.isPending}
          >
            {updateRole.isPending ? 'Actualizando...' : 'Actualizar Rol'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateRole.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

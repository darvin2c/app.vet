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
import { CreateRoleSchema, createRoleSchema } from '@/schemas/roles.schema'
import { useRoleCreate } from '@/hooks/roles/use-role-create'

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Rol</DrawerTitle>
          <DrawerDescription>
            Define un nuevo rol y asigna los permisos correspondientes.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
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
            disabled={createRole.isPending}
          >
            {createRole.isPending ? 'Creando...' : 'Crear Rol'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createRole.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

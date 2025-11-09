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
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { RoleForm } from './role-form'
import { UpdateRoleSchema, updateRoleSchema } from '@/schemas/roles.schema'
import { useRoleUpdate } from '@/hooks/roles/use-role-update'
import { Tables } from '@/types/supabase.types'
import { Field } from '../ui/field'

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Editar Rol</SheetTitle>
            <SheetDescription>
              Modifica la información y permisos del rol.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 min-h-0">
            <div className="px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <RoleForm />
                </form>
              </Form>
            </div>
          </div>

          <SheetFooter>
            <Field orientation="horizontal">
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
            </Field>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

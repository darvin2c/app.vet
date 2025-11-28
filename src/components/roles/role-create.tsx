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
import { CreateRoleSchema, createRoleSchema } from '@/schemas/roles.schema'
import { useRoleCreate } from '@/hooks/roles/use-role-create'
import { Field } from '../ui/field'
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <CanAccess resource="products" action="create">
            <SheetHeader>
              <SheetTitle>Crear Rol</SheetTitle>
              <SheetDescription>
                Define un nuevo rol y asigna los permisos correspondientes.
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
              </Field>
            </SheetFooter>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

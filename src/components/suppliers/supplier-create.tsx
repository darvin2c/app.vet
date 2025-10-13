'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer-form'
import { SupplierForm } from './supplier-form'
import {
  CreateSupplierSchema,
  createSupplierSchema,
} from '@/schemas/suppliers.schema'
import useSupplierCreate from '@/hooks/suppliers/use-supplier-create'
import { Form } from '../ui/form'
import { Button } from '../ui/button'

interface SupplierCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierCreate({ open, onOpenChange }: SupplierCreateProps) {
  const createSupplier = useSupplierCreate()

  const form = useForm<CreateSupplierSchema>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      document_number: '',
      website: '',
      notes: '',
    },
  })

  const onSubmit = async (data: CreateSupplierSchema) => {
    await createSupplier.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Proveedor</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar un nuevo proveedor.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <SupplierForm mode="create" />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createSupplier.isPending}
          >
            {createSupplier.isPending ? 'Creando...' : 'Crear Proveedor'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createSupplier.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

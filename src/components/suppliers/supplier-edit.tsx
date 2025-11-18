'use client'

import { useEffect } from 'react'
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
  UpdateSupplierSchema,
  updateSupplierSchema,
} from '@/schemas/suppliers.schema'
import useSupplierUpdate from '@/hooks/suppliers/use-supplier-update'
import { Tables } from '@/types/supabase.types'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import CanAccess from '@/components/ui/can-access'

type Supplier = Tables<'suppliers'>

interface SupplierEditProps {
  supplier: Supplier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierEdit({
  supplier,
  open,
  onOpenChange,
}: SupplierEditProps) {
  const updateSupplier = useSupplierUpdate()

  const form = useForm<UpdateSupplierSchema>({
    resolver: zodResolver(updateSupplierSchema),
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

  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name || '',
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        document_number: supplier.document_number || '',
        website: supplier.website || '',
        notes: supplier.notes || '',
      })
    }
  }, [supplier, form])

  const onSubmit = async (data: UpdateSupplierSchema) => {
    await updateSupplier.mutateAsync({
      id: supplier.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <CanAccess resource="products" action="update">
          <DrawerHeader>
            <DrawerTitle>Editar Proveedor</DrawerTitle>
            <DrawerDescription>
              Modifica la información del proveedor.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit as any)}
                className="space-y-4"
              >
                <SupplierForm mode="edit" supplier={supplier} />
              </form>
            </Form>
          </div>

          <DrawerFooter>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit as any)}
              disabled={updateSupplier.isPending}
            >
              {updateSupplier.isPending
                ? 'Actualizando...'
                : 'Actualizar Proveedor'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateSupplier.isPending}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </CanAccess>
      </DrawerContent>
    </Drawer>
  )
}

'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierForm } from './supplier-form'
import { UpdateSupplierSchema, updateSupplierSchema } from '@/schemas/suppliers.schema'
import useSupplierUpdate from '@/hooks/suppliers/use-supplier-update'
import { Tables } from '@/types/supabase.types'

interface SupplierEditProps {
  supplier: Tables<'suppliers'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierEdit({ supplier, open, onOpenChange }: SupplierEditProps) {
  const { mutate: updateSupplier, isPending } = useSupplierUpdate()
  
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

  const onSubmit = (data: UpdateSupplierSchema) => {
    updateSupplier(
      { id: supplier.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Proveedor"
      description="Actualiza la información del proveedor"
      trigger={<></>}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SupplierForm />
          
          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              isLoading={isPending}
              disabled={isPending}
            >
              Actualizar Proveedor
            </ResponsiveButton>
            <ResponsiveButton
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </DrawerForm>
  )
}
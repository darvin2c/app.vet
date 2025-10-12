'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      tax_id: '',
      website: '',
      notes: '',
      is_active: true,
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
        city: supplier.city || '',
        state: supplier.state || '',
        postal_code: supplier.postal_code || '',
        country: supplier.country || '',
        tax_id: supplier.tax_id || '',
        website: supplier.website || '',
        notes: supplier.notes || '',
        is_active: supplier.is_active,
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
      form={form}
      onSubmit={onSubmit}
    >
      <SupplierForm />
      
      <DrawerFooter>
        <ResponsiveButton
          type="submit"
          loading={isPending}
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
    </DrawerForm>
  )
}
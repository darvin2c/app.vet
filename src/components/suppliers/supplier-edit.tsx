'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { SupplierForm } from './supplier-form'
import {
  UpdateSupplierSchema,
  updateSupplierSchema,
} from '@/schemas/suppliers.schema'
import useSupplierUpdate from '@/hooks/suppliers/use-supplier-update'
import { Tables } from '@/types/supabase.types'
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
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Proveedor"
        description="Modifica la información del proveedor."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateSupplier.isPending}
        submitLabel="Actualizar Proveedor"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <div className="px-4 overflow-y-auto">
          <SupplierForm mode="edit" supplier={supplier} />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

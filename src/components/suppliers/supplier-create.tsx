'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { SupplierForm } from './supplier-form'
import {
  CreateSupplierSchema,
  createSupplierSchema,
} from '@/schemas/suppliers.schema'
import useSupplierCreate from '@/hooks/suppliers/use-supplier-create'
import CanAccess from '@/components/ui/can-access'

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
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Proveedor"
        description="Completa la información para agregar un nuevo proveedor."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createSupplier.isPending}
        submitLabel="Crear Proveedor"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <div className="px-4">
          <SupplierForm mode="create" />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierForm } from './supplier-form'
import { CreateSupplierSchema, createSupplierSchema } from '@/schemas/suppliers.schema'
import useSupplierCreate from '@/hooks/suppliers/use-supplier-create'

interface SupplierCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierCreate({ open, onOpenChange }: SupplierCreateProps) {
  const { mutate: createSupplier, isPending } = useSupplierCreate()
  
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
      is_active: true,
    },
  })

  const onSubmit = (data: CreateSupplierSchema) => {
    createSupplier(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Crear Proveedor"
      description="Registra un nuevo proveedor en el sistema"
      form={form}
      onSubmit={onSubmit}
    >
      <SupplierForm />
      
      <DrawerFooter>
        <ResponsiveButton
          type="submit"
          isLoading={isPending}
          disabled={isPending}
        >
          Crear Proveedor
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
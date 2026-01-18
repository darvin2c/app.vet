'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierBrandForm } from './supplier-brand-form'
import useSupplierBrandCreate from '@/hooks/supplier-brands/use-supplier-brand-create'
import {
  createSupplierBrandSchema,
  CreateSupplierBrandSchema,
} from '@/schemas/supplier-brands.schema'
import { Plus } from 'lucide-react'
import CanAccess from '@/components/ui/can-access'

interface SupplierBrandCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierId?: string
  brandId?: string
}

export function SupplierBrandCreate({
  open,
  onOpenChange,
  supplierId,
  brandId,
}: SupplierBrandCreateProps) {
  const { mutate: createSupplierBrand, isPending } = useSupplierBrandCreate()

  const form = useForm<CreateSupplierBrandSchema>({
    resolver: zodResolver(createSupplierBrandSchema),
    defaultValues: {
      supplier_id: supplierId || '',
      brand_id: brandId || '',
    },
  })

  const onSubmit = (data: CreateSupplierBrandSchema) => {
    createSupplierBrand(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Asignar Marca"
        description="Asigna una marca a un proveedor"
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={isPending}
        submitLabel="Asignar Marca"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <FormProvider {...form}>
          <div className="space-y-4 px-4">
            <SupplierBrandForm />
            <ResponsiveButton type="submit" icon={Plus} className="sr-only">
              Asignar Marca
            </ResponsiveButton>
          </div>
        </FormProvider>
      </FormSheet>
    </CanAccess>
  )
}

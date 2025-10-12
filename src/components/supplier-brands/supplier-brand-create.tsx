'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierBrandForm } from './supplier-brand-form'
import useSupplierBrandCreate from '@/hooks/supplier-brands/use-supplier-brand-create'
import { createSupplierBrandSchema, CreateSupplierBrandSchema } from '@/schemas/supplier-brands.schema'
import { Plus } from 'lucide-react'

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
  brandId 
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
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Asignar Marca a Proveedor"
      description="Asigna una marca a un proveedor específico"
      trigger={<></>}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SupplierBrandForm />
          
          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              icon={Plus}
            >
              Asignar Marca
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              icon={Plus}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </DrawerForm>
  )
}
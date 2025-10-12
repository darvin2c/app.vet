'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createProductBrandSchema,
  CreateProductBrand,
} from '@/schemas/product-brands.schema'
import useProductBrandCreate from '@/hooks/product-brands/use-product-brand-create'
import { Drawer } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProductBrandForm } from './product-brand-form'

interface ProductBrandCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandCreate({
  open,
  onOpenChange,
}: ProductBrandCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: createProductBrand } = useProductBrandCreate()

  const form = useForm<CreateProductBrand>({
    resolver: zodResolver(createProductBrandSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: CreateProductBrand) => {
    try {
      setIsSubmitting(true)
      await createProductBrand(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al crear marca de producto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProductBrandForm />

          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Crear Marca
            </ResponsiveButton>
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </Drawer>
  )
}

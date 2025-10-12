'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProductBrandSchema, UpdateProductBrand } from '@/schemas/product-brands.schema'
import { useProductBrandUpdate } from '@/hooks/product-brands/use-product-brand-update'
import { Tables } from '@/types/supabase.types'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { ProductBrandForm } from './product-brand-form'

interface ProductBrandEditProps {
  brand: Tables<'product_brands'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandEdit({ brand, open, onOpenChange }: ProductBrandEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: updateProductBrand } = useProductBrandUpdate()

  const form = useForm<UpdateProductBrand>({
    resolver: zodResolver(updateProductBrandSchema),
    defaultValues: {
      name: brand.name,
      description: brand.description || '',
      active: brand.active,
    },
  })

  // Actualizar valores del formulario cuando cambie la marca
  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
        active: brand.active,
      })
    }
  }, [brand, form])

  const onSubmit = async (data: UpdateProductBrand) => {
    try {
      setIsSubmitting(true)
      await updateProductBrand({ id: brand.id, data })
      onOpenChange(false)
    } catch (error) {
      console.error('Error al actualizar marca de producto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Marca de Producto"
      description={`Editar información de ${brand.name}`}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProductBrandForm />
          
          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Guardar Cambios
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
    </DrawerForm>
  )
}
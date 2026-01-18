'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { ProductBrandForm } from './product-brand-form'
import useProductBrandUpdate from '@/hooks/product-brands/use-product-brand-update'
import { Tables } from '@/types/supabase.types'
import { productBrandUpdateSchema } from '@/schemas/product-brands.schema'
import CanAccess from '@/components/ui/can-access'

interface ProductBrandEditProps {
  brand: Tables<'product_brands'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandEdit({
  brand,
  open,
  onOpenChange,
}: ProductBrandEditProps) {
  const mutation = useProductBrandUpdate()

  const form = useForm({
    resolver: zodResolver(productBrandUpdateSchema),
    defaultValues: {
      name: brand.name,
      description: brand.description || '',
      is_active: brand.is_active,
    },
  })

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
        is_active: brand.is_active,
      })
    }
  }, [brand, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: brand.id,
      ...data,
    })
    onOpenChange(false)
  })

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Marca de Producto"
        description="Modifica los datos de la marca de producto."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Actualizar Marca"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <div className="px-4 overflow-y-auto">
          <ProductBrandForm />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

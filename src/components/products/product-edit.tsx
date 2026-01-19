'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ProductForm } from './product-form'
import useUpdateProduct from '@/hooks/products/use-product-update'
import { Tables } from '@/types/supabase.types'
import { productUpdateSchema } from '@/schemas/products.schema'
import CanAccess from '@/components/ui/can-access'

interface ProductEditProps {
  product: Tables<'products'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductEdit({ product, open, onOpenChange }: ProductEditProps) {
  const updateProduct = useUpdateProduct()

  const form = useForm({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku ?? undefined,
      category_id: product.category_id ?? undefined,
      unit_id: product.unit_id ?? undefined,
      is_active: product.is_active,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const formattedData = {
      ...data,
      expiry_date: data.expiry_date
        ? data.expiry_date.toISOString()
        : undefined,
    }
    await updateProduct.mutateAsync({
      id: product.id,
      data: formattedData,
    })
    onOpenChange(false)
  })

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Producto"
        description="Modifica la información del producto."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateProduct.isPending}
        submitLabel="Actualizar Producto"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <ProductForm mode="edit" product={product} />
      </FormSheet>
    </CanAccess>
  )
}

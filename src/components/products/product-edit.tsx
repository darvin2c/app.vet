'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ProductForm } from './product-form'
import useUpdateProduct from '@/hooks/products/use-product-update'
import useProduct from '@/hooks/products/use-product'
import { productUpdateSchema } from '@/schemas/products.schema'
import CanAccess from '@/components/ui/can-access'
import { Spinner } from '@/components/ui/spinner'

interface ProductEditProps {
  productId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductEdit({
  productId,
  open,
  onOpenChange,
}: ProductEditProps) {
  const { data: product, isLoading } = useProduct(productId)
  const updateProduct = useUpdateProduct()

  const form = useForm({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: {
      name: '',
      sku: undefined,
      category_id: undefined,
      unit_id: undefined,
      is_active: true,
      cost: 0,
      price: 0,
      barcode: '',
      brand_id: undefined,
      notes: '',
    },
  })

  // Actualizar el formulario cuando se carga el producto
  useEffect(() => {
    if (product && !form.formState.isDirty) {
      form.reset({
        name: product.name,
        sku: product.sku ?? undefined,
        category_id: product.category_id ?? undefined,
        unit_id: product.unit_id ?? undefined,
        is_active: product.is_active,
        cost: product.cost ?? 0,
        price: product.price,
        barcode: product.barcode ?? '',
        brand_id: product.brand_id ?? undefined,
        notes: product.notes ?? '',
      })
    }
  }, [product, form])

  const onSubmit = form.handleSubmit(async (data) => {
    const formattedData = {
      ...data,
      expiry_date: data.expiry_date
        ? data.expiry_date.toISOString()
        : undefined,
    }
    await updateProduct.mutateAsync({
      id: productId,
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
        <ProductForm mode="edit" product={product || undefined} />
      </FormSheet>
    </CanAccess>
  )
}

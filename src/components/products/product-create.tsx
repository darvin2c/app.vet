'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ProductForm } from './product-form'
import useCreateProduct from '@/hooks/products/use-product-create'
import { productCreateSchema } from '@/schemas/products.schema'
import CanAccess from '../ui/can-access'

interface ProductCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCreate({ open, onOpenChange }: ProductCreateProps) {
  const createProduct = useCreateProduct()

  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      sku: undefined,
      category_id: undefined,
      unit_id: undefined,
      is_active: true,
    },
  })

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      expiry_date: data.expiry_date
        ? data.expiry_date.toISOString()
        : undefined,
    }
    await createProduct.mutateAsync(formattedData)
    form.reset()
    onOpenChange(false)
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Producto"
        description="Completa la información para agregar un nuevo producto."
        form={form as any}
        onSubmit={onSubmit}
        isPending={createProduct.isPending}
        submitLabel="Crear Producto"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <ProductForm mode="create" />
      </FormSheet>
    </CanAccess>
  )
}

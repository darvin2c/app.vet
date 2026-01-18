'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'
import CanAccess from '@/components/ui/can-access'

import { ProductCategoryForm } from './product-category-form'
import useProductCategoryCreate from '@/hooks/product-categories/use-product-category-create'
import { productCategoryCreateSchema } from '@/schemas/product-categories.schema'

interface ProductCategoryCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductCategoryCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProductCategoryCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = useProductCategoryCreate()

  const form = useForm({
    resolver: zodResolver(productCategoryCreateSchema),
    defaultValues: {
      is_active: true,
    },
  })
  const { handleSubmit, reset } = form
  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    reset()
    setOpen(false)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open as boolean}
        onOpenChange={setOpen as any}
        trigger={children as any}
        title="Crear Categoría de Producto"
        description="Completa los datos para crear una nueva categoría de producto."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Crear Categoría"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <div className="px-4">
          <ProductCategoryForm />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

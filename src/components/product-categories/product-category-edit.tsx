'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { ProductCategoryForm } from './product-category-form'
import useUpdateProductCategory from '@/hooks/product-categories/use-product-category-update'
import { Tables } from '@/types/supabase.types'
import { productCategoryUpdateSchema } from '@/schemas/product-categories.schema'

interface ProductCategoryEditProps {
  category: Tables<'product_categories'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryEdit({
  category,
  open,
  onOpenChange,
}: ProductCategoryEditProps) {
  const mutation = useUpdateProductCategory()

  const form = useForm({
    resolver: zodResolver(productCategoryUpdateSchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
      is_active: category.is_active,
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
      })
    }
  }, [category, form])

  const { handleSubmit, reset } = form
  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: category.id,
      ...data,
    })
    onOpenChange(false)
    reset()
  })

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Categoría de Producto"
      description="Modifica los datos de la categoría de producto."
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={mutation.isPending}
      submitLabel="Actualizar Categoría"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-xl"
    >
      <div className="px-4 overflow-y-auto">
        <ProductCategoryForm />
      </div>
    </FormSheet>
  )
}

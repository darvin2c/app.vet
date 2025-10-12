'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Drawer } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductCategoryForm } from './product-category-form'
import {
  UpdateProductCategorySchema,
  updateProductCategorySchema,
} from '@/schemas/product-categories.schema'
import useUpdateProductCategory from '@/hooks/product-categories/use-product-category-update'
import { Tables } from '@/types/supabase.types'

type ProductCategory = Tables<'product_categories'>

interface ProductCategoryEditProps {
  category: ProductCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryEdit({
  category,
  open,
  onOpenChange,
}: ProductCategoryEditProps) {
  const updateProductCategory = useUpdateProductCategory()

  const form = useForm({
    resolver: zodResolver(updateProductCategorySchema),
    defaultValues: {
      name: category.name,
    },
  })

  const onSubmit = async (data: UpdateProductCategorySchema) => {
    try {
      await updateProductCategory.mutateAsync({
        id: category.id,
        name: data.name,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ProductCategoryForm />

          <DrawerFooter>
            <Button type="submit" disabled={updateProductCategory.isPending}>
              {updateProductCategory.isPending
                ? 'Actualizando...'
                : 'Actualizar Categoría'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProductCategory.isPending}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </Drawer>
  )
}

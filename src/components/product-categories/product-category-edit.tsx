'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
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
      description: category.description || undefined,
      is_active: category.is_active,
    },
  })

  const onSubmit = async (data: UpdateProductCategorySchema) => {
    try {
      await updateProductCategory.mutateAsync({
        id: category.id,
        data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  const footer = (
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
  )

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Categoría</DrawerTitle>
          <DrawerDescription>
            Modifica la información de la categoría.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductCategoryForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateProductCategory.isPending}
          >
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
      </DrawerContent>
    </Drawer>
  )
}

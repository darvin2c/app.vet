'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'

import { ProductCategoryForm } from './product-category-form'
import { ProductCategorySchema, type ProductCategorySchemaType } from '@/schemas/product-category.schema'
import { useProductCategoryUpdate } from '@/hooks/product-categories/use-product-category-update'
import { Tables } from '@/types/supabase.types'

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
  const mutation = useProductCategoryUpdate()

  const form = useForm<ProductCategorySchemaType>({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    },
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description,
        is_active: category.is_active,
      })
    }
  }, [category, form])

  const onSubmit = async (data: ProductCategorySchemaType) => {
    await mutation.mutateAsync({
      id: category.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Categoría de Producto</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la categoría de producto.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="px-4 overflow-y-auto">
              <ProductCategoryForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
                disabled={mutation.isPending}
              >
                Actualizar Categoría
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Drawer } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductCategoryForm } from './product-category-form'
import {
  CreateProductCategorySchema,
  createProductCategorySchema,
} from '@/schemas/product-categories.schema'
import useProductCategoryCreate from '@/hooks/product-categories/use-product-category-create'

interface ProductCategoryCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryCreated?: (category: any) => void
}

export function ProductCategoryCreate({
  open,
  onOpenChange,
  onCategoryCreated,
}: ProductCategoryCreateProps) {
  const createProductCategory = useProductCategoryCreate()

  const form = useForm({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: CreateProductCategorySchema) => {
    try {
      const result = await createProductCategory.mutateAsync({
        name: data.name,
      })
      form.reset()
      onOpenChange(false)
      if (onCategoryCreated && result) {
        onCategoryCreated(result)
      }
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
            <Button type="submit" disabled={createProductCategory.isPending}>
              {createProductCategory.isPending
                ? 'Creando...'
                : 'Crear Categoría'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createProductCategory.isPending}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </Drawer>
  )
}

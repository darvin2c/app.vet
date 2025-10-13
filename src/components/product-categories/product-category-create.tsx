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
  CreateProductCategorySchema,
  createProductCategorySchema,
} from '@/schemas/product-categories.schema'
import useProductCategoryCreate from '@/hooks/product-categories/use-product-category-create'

interface ProductCategoryCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryCreate({
  open,
  onOpenChange,
}: ProductCategoryCreateProps) {
  const createProductCategory = useProductCategoryCreate()

  const form = useForm({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: '',
      description: undefined,
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateProductCategorySchema) => {
    await createProductCategory.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Categoría de Producto</DrawerTitle>
          <DrawerDescription>
            Completa la información para registrar una nueva categoría de
            producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
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
            disabled={createProductCategory.isPending}
          >
            {createProductCategory.isPending
              ? 'Creando...'
              : 'Crear Categoría de Producto'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createProductCategory.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

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
import useCreateProductCategory from '@/hooks/product-categories/use-create-product-category'

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
  const createProductCategory = useCreateProductCategory()

  const form = useForm({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      name: '',
      code: '',
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateProductCategorySchema) => {
    try {
      const result = await createProductCategory.mutateAsync({
        name: data.name,
        code: data.code,
        is_active: data.is_active,
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
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Crear Categoría de Producto</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar una nueva categoría de
            producto.
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
            disabled={createProductCategory.isPending}
          >
            {createProductCategory.isPending ? 'Creando...' : 'Crear Categoría'}
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

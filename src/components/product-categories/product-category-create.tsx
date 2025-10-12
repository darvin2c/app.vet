'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DrawerForm, DrawerFooter } from '@/components/ui/drawer-form'
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
    try {
      await createProductCategory.mutateAsync(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Crear Categoría de Producto"
      description="Completa la información para agregar una nueva categoría de producto."
      footer={
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
      }
    >
      <div className="px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-4"
          >
            <ProductCategoryForm mode="create" />
          </form>
        </Form>
      </div>
    </DrawerForm>
  )
}

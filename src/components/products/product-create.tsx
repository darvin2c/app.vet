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
import { ProductForm } from './product-form'
import {
  CreateProductSchema,
  createProductSchema,
} from '@/schemas/products.schema'
import useCreateProduct from '@/hooks/products/use-create-product'

interface ProductCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCreate({ open, onOpenChange }: ProductCreateProps) {
  const createProduct = useCreateProduct()

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      sku: undefined,
      category_id: undefined,
      unit_id: undefined,
      min_stock: undefined,
      stock: undefined,
      is_active: true,
    },
  })

  const onSubmit = async (data: CreateProductSchema) => {
    await createProduct.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Crear Producto</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar un nuevo producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductForm mode="create" />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createProduct.isPending}
          >
            {createProduct.isPending ? 'Creando...' : 'Crear Producto'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createProduct.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

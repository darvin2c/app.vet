'use client'

import { useState } from 'react'
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
  UpdateProductSchema,
  updateProductSchema,
} from '@/schemas/products.schema'
import useUpdateProduct from '@/hooks/products/use-update-product'
import { Tables } from '@/types/supabase.types'

interface ProductEditProps {
  product: Tables<'products'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductEdit({ product, open, onOpenChange }: ProductEditProps) {
  const updateProduct = useUpdateProduct()

  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku ?? undefined,
      category_id: product.category_id ?? undefined,
      unit_id: product.unit_id ?? undefined,
      min_stock: product.min_stock ?? undefined,
      is_active: product.is_active,
    },
  })

  const onSubmit = async (data: UpdateProductSchema) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Editar Producto</DrawerTitle>
          <DrawerDescription>
            Modifica la información del producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductForm mode="edit" product={product} />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateProduct.isPending}
          >
            {updateProduct.isPending
              ? 'Actualizando...'
              : 'Actualizar Producto'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateProduct.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

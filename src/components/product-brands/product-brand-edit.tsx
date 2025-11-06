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

import { ProductBrandForm } from './product-brand-form'
import useProductBrandUpdate from '@/hooks/product-brands/use-product-brand-update'
import { Tables } from '@/types/supabase.types'
import { productBrandUpdateSchema } from '@/schemas/product-brands.schema'

interface ProductBrandEditProps {
  brand: Tables<'product_brands'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandEdit({
  brand,
  open,
  onOpenChange,
}: ProductBrandEditProps) {
  const mutation = useProductBrandUpdate()

  const form = useForm({
    resolver: zodResolver(productBrandUpdateSchema),
    defaultValues: {
      name: brand.name,
      description: brand.description || '',
    },
  })

  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || '',
      })
    }
  }, [brand, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: brand.id,
      ...data,
    })
    onOpenChange(false)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Marca de Producto</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la marca de producto.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="px-4 overflow-y-auto">
              <ProductBrandForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={mutation.isPending}
              >
                Actualizar Marca
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

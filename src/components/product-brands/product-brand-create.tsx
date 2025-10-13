'use client'

import { useState } from 'react'
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
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'

import { ProductBrandForm } from './product-brand-form'
import { ProductBrandSchema, type ProductBrandSchemaType } from '@/schemas/product-brand.schema'
import { useProductBrandCreate } from '@/hooks/product-brands/use-product-brand-create'

interface ProductBrandCreateProps {
  children?: React.ReactNode
}

export function ProductBrandCreate({ children }: ProductBrandCreateProps) {
  const [open, setOpen] = useState(false)
  const mutation = useProductBrandCreate()

  const form = useForm<ProductBrandSchemaType>({
    resolver: zodResolver(ProductBrandSchema),
  })

  const onSubmit = async (data: ProductBrandSchemaType) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Marca de Producto</DrawerTitle>
          <DrawerDescription>
            Completa los datos para crear una nueva marca de producto.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="px-4">
              <ProductBrandForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
                disabled={mutation.isPending}
              >
                Crear Marca
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
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

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
} from '@/components/ui/drawer-form'
import { Form } from '@/components/ui/form'

import { ProductCategoryForm } from './product-category-form'
import useProductCategoryCreate from '@/hooks/product-categories/use-product-category-create'
import { productCategoryCreateSchema } from '@/schemas/product-categories.schema'

interface ProductCategoryCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductCategoryCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProductCategoryCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = useProductCategoryCreate()

  const form = useForm({
    resolver: zodResolver(productCategoryCreateSchema),
    defaultValues: {
      is_active: true,
    },
  })
  const { handleSubmit, reset } = form
  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    reset()
    setOpen(false)
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="!max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Crear Categoría de Producto</DrawerTitle>
          <DrawerDescription>
            Completa los datos para crear una nueva categoría de producto.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="px-4">
              <ProductCategoryForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={mutation.isPending}
              >
                Crear Categoría
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

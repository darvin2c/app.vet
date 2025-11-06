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
import useProductBrandCreate from '@/hooks/product-brands/use-product-brand-create'
import { productBrandCreateSchema } from '@/schemas/product-brands.schema'

interface ProductBrandCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProductBrandCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProductBrandCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = useProductBrandCreate()

  const form = useForm({
    resolver: zodResolver(productBrandCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  })

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
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="px-4">
              <ProductBrandForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={onSubmit}
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

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

import { ProductUnitForm } from './product-unit-form'
import useProductUnitCreate from '@/hooks/product-units/use-product-unit-create'
import { productUnitCreateSchema } from '@/schemas/product-units.schema'

interface ProductUnitCreateProps {
  children?: React.ReactNode
  controlled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onUnitCreated?: (unit: any) => void
}

export function ProductUnitCreate({
  children,
  controlled = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onUnitCreated,
}: ProductUnitCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const mutation = useProductUnitCreate()

  const open = controlled ? controlledOpen : internalOpen
  const onOpenChange = controlled ? controlledOnOpenChange : setInternalOpen

  const form = useForm({
    resolver: zodResolver(productUnitCreateSchema),
  })

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await mutation.mutateAsync(data)
    form.reset()
    onOpenChange?.(false)
    onUnitCreated?.(result)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {!controlled && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Unidad de Producto</DrawerTitle>
          <DrawerDescription>
            Completa los datos para crear una nueva unidad de producto.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="px-4">
              <ProductUnitForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
                disabled={mutation.isPending}
              >
                Crear Unidad
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
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

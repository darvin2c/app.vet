'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'

import { ProductUnitForm } from './product-unit-form'
import useProductUnitCreate from '@/hooks/product-units/use-product-unit-create'
import { productUnitCreateSchema } from '@/schemas/product-units.schema'
import { ScrollArea } from '@/components/ui/scroll-area'

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      {!controlled && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="!max-w-4xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Crear Unidad de Producto</SheetTitle>
            <SheetDescription>
              Completa los datos para crear una nueva unidad de producto.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="px-4">
                <ProductUnitForm />
              </div>
              <SheetFooter className="flex-row">
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
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

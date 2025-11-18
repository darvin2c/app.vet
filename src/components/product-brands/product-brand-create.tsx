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

import { ProductBrandForm } from './product-brand-form'
import useProductBrandCreate from '@/hooks/product-brands/use-product-brand-create'
import { productBrandCreateSchema } from '@/schemas/product-brands.schema'
import { ScrollArea } from '../ui/scroll-area'
import CanAccess from '@/components/ui/can-access'

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="!max-w-2xl">
        <ScrollArea>
          <CanAccess resource="products" action="create">
            <SheetHeader>
              <SheetTitle>Crear Marca de Producto</SheetTitle>
              <SheetDescription>
                Completa los datos para crear una nueva marca de producto.
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="px-4">
                  <ProductBrandForm />
                </div>
                <SheetFooter className="flex-row">
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
                </SheetFooter>
              </form>
            </Form>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

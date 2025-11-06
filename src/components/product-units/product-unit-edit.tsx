'use client'

import { useEffect } from 'react'
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
} from '@/components/ui/sheet'
import { Form } from '@/components/ui/form'

import { ProductUnitForm } from './product-unit-form'
import useProductUnitUpdate from '@/hooks/product-units/use-product-unit-update'
import { Tables } from '@/types/supabase.types'
import { productUnitUpdateSchema } from '@/schemas/product-units.schema'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProductUnitEditProps {
  unit: Tables<'product_units'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductUnitEdit({
  unit,
  open,
  onOpenChange,
}: ProductUnitEditProps) {
  const mutation = useProductUnitUpdate()

  const form = useForm({
    resolver: zodResolver(productUnitUpdateSchema),
    defaultValues: {
      name: unit.name,
      abbreviation: unit.abbreviation,
      is_active: unit.is_active,
    },
  })

  useEffect(() => {
    if (unit) {
      form.reset({
        name: unit.name,
        abbreviation: unit.abbreviation,
        is_active: unit.is_active,
      })
    }
  }, [unit, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: unit.id,
      ...data,
    })
    onOpenChange(false)
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-4xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Editar Unidad de Producto</SheetTitle>
            <SheetDescription>
              Modifica los datos de la unidad de producto.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="px-4 overflow-y-auto">
                <ProductUnitForm />
              </div>
              <SheetFooter className="flex-row">
                <Button
                  type="submit"
                  onClick={onSubmit}
                  disabled={mutation.isPending}
                >
                  Actualizar Unidad
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
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

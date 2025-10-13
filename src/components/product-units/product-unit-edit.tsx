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

import { ProductUnitForm } from './product-unit-form'
import { updateProductUnitSchema, type UpdateProductUnitSchema } from '@/schemas/product-units.schema'
import useProductUnitUpdate from '@/hooks/product-units/use-product-unit-update'
import { Tables } from '@/types/supabase.types'

interface ProductUnitEditProps {
  unit: Tables<'product_units'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductUnitEdit({ unit, open, onOpenChange }: ProductUnitEditProps) {
  const mutation = useProductUnitUpdate()

  const form = useForm<UpdateProductUnitSchema>({
    resolver: zodResolver(updateProductUnitSchema),
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

  const onSubmit = async (data: UpdateProductUnitSchema) => {
    await mutation.mutateAsync({
      id: unit.id,
      ...data,
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Unidad de Producto</DrawerTitle>
          <DrawerDescription>
            Modifica los datos de la unidad de producto.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
            <div className="px-4 overflow-y-auto">
              <ProductUnitForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit as any)}
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
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

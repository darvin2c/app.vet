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
import { ProductUnitSchema, type ProductUnitSchemaType } from '@/schemas/product-unit.schema'
import { useProductUnitUpdate } from '@/hooks/product-units/use-product-unit-update'
import { Tables } from '@/types/supabase.types'

interface ProductUnitEditProps {
  productUnit: Tables<'product_units'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductUnitEdit({ productUnit, open, onOpenChange }: ProductUnitEditProps) {
  const mutation = useProductUnitUpdate()

  const form = useForm<ProductUnitSchemaType>({
    resolver: zodResolver(ProductUnitSchema),
    defaultValues: {
      name: productUnit.name,
      abbreviation: productUnit.abbreviation,
      is_active: productUnit.is_active,
    },
  })

  useEffect(() => {
    if (productUnit) {
      form.reset({
        name: productUnit.name,
        abbreviation: productUnit.abbreviation,
        is_active: productUnit.is_active,
      })
    }
  }, [productUnit, form])

  const onSubmit = async (data: ProductUnitSchemaType) => {
    await mutation.mutateAsync({
      id: productUnit.id,
      data,
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

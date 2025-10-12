'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductUnitForm } from './product-unit-form'
import {
  UpdateProductUnitSchema,
  updateProductUnitSchema,
} from '@/schemas/product-units.schema'
import useUpdateProductUnit from '@/hooks/product-units/use-product-unit-update'
import { Tables } from '@/types/supabase.types'

type ProductUnit = Tables<'product_units'>

interface ProductUnitEditProps {
  unit: ProductUnit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductUnitEdit({
  unit,
  open,
  onOpenChange,
}: ProductUnitEditProps) {
  const updateProductUnit = useUpdateProductUnit()

  const form = useForm({
    resolver: zodResolver(updateProductUnitSchema),
    defaultValues: {
      name: unit.name || '',
      abbreviation: unit.abbreviation || '',
      is_active: unit.is_active,
    },
  })

  const onSubmit = async (data: UpdateProductUnitSchema) => {
    try {
      await updateProductUnit.mutateAsync({
        id: unit.id,
        name: data.name,
        abbreviation: data.abbreviation,
        is_active: data.is_active,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Editar Unidad</DrawerTitle>
          <DrawerDescription>
            Modifica la información de la unidad de producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductUnitForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateProductUnit.isPending}
          >
            {updateProductUnit.isPending
              ? 'Actualizando...'
              : 'Actualizar Unidad'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateProductUnit.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

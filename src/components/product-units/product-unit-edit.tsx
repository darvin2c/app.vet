'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { ProductUnitForm } from './product-unit-form'
import useProductUnitUpdate from '@/hooks/product-units/use-product-unit-update'
import { Tables } from '@/types/supabase.types'
import { productUnitUpdateSchema } from '@/schemas/product-units.schema'
import CanAccess from '@/components/ui/can-access'

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

  const onSubmit = async (data: any) => {
    await mutation.mutateAsync({
      id: unit.id,
      ...data,
    })
    onOpenChange(false)
  }

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Unidad de Producto"
        description="Modifica los datos de la unidad de producto."
        form={form as any}
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        submitLabel="Actualizar Unidad"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-lg"
      >
        <ProductUnitForm />
      </FormSheet>
    </CanAccess>
  )
}

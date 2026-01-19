'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { ProductUnitForm } from './product-unit-form'
import useProductUnitCreate from '@/hooks/product-units/use-product-unit-create'
import { productUnitCreateSchema } from '@/schemas/product-units.schema'
import CanAccess from '@/components/ui/can-access'

interface ProductUnitCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUnitCreated?: (unit: any) => void
}

export function ProductUnitCreate({
  open,
  onOpenChange,
  onUnitCreated,
}: ProductUnitCreateProps) {
  const mutation = useProductUnitCreate()

  const form = useForm({
    resolver: zodResolver(productUnitCreateSchema),
    defaultValues: {
      name: '',
      abbreviation: '',
      is_active: true,
    },
  })

  const onSubmit = async (data: any) => {
    const result = await mutation.mutateAsync(data)
    form.reset()
    onOpenChange(false)
    onUnitCreated?.(result)
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Unidad de Producto"
        description="Completa los datos para crear una nueva unidad de producto."
        form={form as any}
        onSubmit={onSubmit}
        isPending={mutation.isPending}
        submitLabel="Crear Unidad"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <ProductUnitForm />
      </FormSheet>
    </CanAccess>
  )
}

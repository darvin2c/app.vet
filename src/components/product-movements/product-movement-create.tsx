'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ProductMovementForm } from './product-movement-form'
import {
  CreateProductMovementSchema,
  CreateProductMovementData,
} from '@/schemas/product-movements.schema'
import useProductMovementCreate from '@/hooks/product-movements/use-product-movement-create'
import CanAccess from '@/components/ui/can-access'
import { Tables } from '@/types/supabase.types'

interface ProductMovementCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId?: string
  product?: Tables<'products'>
}

export function ProductMovementCreate({
  open,
  onOpenChange,
  productId,
  product,
}: ProductMovementCreateProps) {
  const createProductMovement = useProductMovementCreate()

  const form = useForm({
    resolver: zodResolver(CreateProductMovementSchema),
    defaultValues: {
      product_id: productId,
      quantity: 0,
      unit_cost: null,
      note: null,
      reference: null,
    },
  })

  const onSubmit = async (data: CreateProductMovementData) => {
    await createProductMovement.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Movimiento de Producto"
        description="Completa la información para agregar un nuevo movimiento de producto."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createProductMovement.isPending}
        submitLabel="Crear Movimiento"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <ProductMovementForm
          mode="create"
          productId={productId}
          product={product}
        />
      </FormSheet>
    </CanAccess>
  )
}

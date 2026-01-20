'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { ProductMovementForm } from './product-movement-form'
import {
  UpdateProductMovementSchema,
  UpdateProductMovementData,
} from '@/schemas/product-movements.schema'
import useProductMovementUpdate from '@/hooks/product-movements/use-product-movement-update'
import { Tables } from '@/types/supabase.types'

interface ProductMovementEditProps {
  movement: Tables<'product_movements'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductMovementEdit({
  movement,
  open,
  onOpenChange,
}: ProductMovementEditProps) {
  const updateProductMovement = useProductMovementUpdate()

  const form = useForm({
    resolver: zodResolver(UpdateProductMovementSchema),
    defaultValues: {
      reference: movement.reference ?? undefined,
      note: movement.note ?? undefined,
    },
  })

  const onSubmit = async (data: UpdateProductMovementData) => {
    try {
      await updateProductMovement.mutateAsync({
        id: movement.id,
        data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Movimiento de Producto"
      description="Modifica la información del movimiento de producto."
      form={form as any}
      onSubmit={onSubmit as any}
      isPending={updateProductMovement.isPending}
      submitLabel="Actualizar Movimiento"
      cancelLabel="Cancelar"
      side="right"
      className="!max-w-xl"
    >
      <ProductMovementForm mode="update" productMovement={movement} />
    </FormSheet>
  )
}

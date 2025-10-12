'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductMovementForm } from './product-movement-form'
import {
  UpdateProductMovementSchema,
  UpdateProductMovementData,
} from '@/schemas/product-movements.schema'
import useProductMovementUpdate from '@/hooks/product-movements/use-product-movement-update'
import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'

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
      product_id: movement.product_id,
      source: movement.source ?? undefined,
      quantity: movement.quantity,
      unit_cost: movement.unit_cost ?? undefined,
      reference: movement.reference ?? undefined,
      note: movement.note ?? undefined,
      related_id: movement.related_id ?? undefined,
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
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Movimiento"
      description="Modifica la información del movimiento de producto."
      trigger={<></>}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit as any)}
          className="space-y-4"
        >
          <ProductMovementForm />

          <DrawerFooter>
            <Button type="submit" disabled={updateProductMovement.isPending}>
              {updateProductMovement.isPending
                ? 'Actualizando...'
                : 'Actualizar Movimiento'}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProductMovement.isPending}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerForm>
  )
}

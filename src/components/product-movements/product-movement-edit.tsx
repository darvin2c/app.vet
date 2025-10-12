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
import { ProductMovementForm } from './product-movement-form'
import {
  UpdateProductMovementSchema,
  UpdateProductMovementData,
} from '@/schemas/product-movements.schema'
import useUpdateProductMovement from '@/hooks/product-movements/use-update-product-movement'
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
  const updateProductMovement = useUpdateProductMovement()

  const form = useForm({
    resolver: zodResolver(UpdateProductMovementSchema),
    defaultValues: {
      product_id: movement.product_id,
      reference_type: movement.reference_type ?? undefined,
      quantity: movement.quantity,
      movement_date: new Date(movement.movement_date),
      unit_cost: movement.unit_cost ?? undefined,
      total_cost: movement.total_cost ?? undefined,
      reference_id: movement.reference_id ?? undefined,
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-[600px]">
        <DrawerHeader>
          <DrawerTitle>Editar Movimiento</DrawerTitle>
          <DrawerDescription>
            Modifica la información del movimiento de producto.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductMovementForm />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateProductMovement.isPending}
          >
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
      </DrawerContent>
    </Drawer>
  )
}

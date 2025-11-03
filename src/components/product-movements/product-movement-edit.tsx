'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ProductMovementForm } from './product-movement-form'
import {
  UpdateProductMovementSchema,
  UpdateProductMovementData,
} from '@/schemas/product-movements.schema'
import useProductMovementUpdate from '@/hooks/product-movements/use-product-movement-update'
import { Tables } from '@/types/supabase.types'
import { Spinner } from '../ui/spinner'

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
      quantity: movement.quantity,
      unit_cost: movement.unit_cost ?? undefined,
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Editar Movimiento de Producto</SheetTitle>
          <SheetDescription>
            Modifica la información del movimiento de producto.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <ProductMovementForm mode="update" productMovement={movement} />
            </form>
          </Form>
        </ScrollArea>

        <SheetFooter className="gap-2 flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateProductMovement.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateProductMovement.isPending}
          >
            {updateProductMovement.isPending ? (
              <>
                <Spinner />
                Actualizando...
              </>
            ) : (
              'Actualizar Movimiento'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

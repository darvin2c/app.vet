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
import { OrderForm } from './order-form'
import { UpdateOrderSchema, updateOrderSchema } from '@/schemas/orders.schema'
import useOrderUpdate from '@/hooks/orders/use-order-update'
import { Tables } from '@/types/supabase.types'

interface OrderEditProps {
  order: Tables<'orders'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderEdit({ order, open, onOpenChange }: OrderEditProps) {
  const updateOrder = useOrderUpdate()

  const form = useForm({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      custumer_id: order.custumer_id,
      pet_id: order.pet_id ?? '',
      order_number: order.order_number ?? '',
      status: order.status as
        | 'draft'
        | 'confirmed'
        | 'paid'
        | 'cancelled'
        | 'refunded',
      currency: order.currency,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      paid_amount: order.paid_amount,
      notes: order.notes ?? '',
    },
  })

  const onSubmit = async (data: UpdateOrderSchema) => {
    await updateOrder.mutateAsync({
      id: order.id,
      data,
    })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Orden</DrawerTitle>
          <DrawerDescription>
            Modifica la información de la orden de venta.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <OrderForm mode="edit" order={order} />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updateOrder.isPending}
          >
            {updateOrder.isPending ? 'Actualizando...' : 'Actualizar Orden'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateOrder.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

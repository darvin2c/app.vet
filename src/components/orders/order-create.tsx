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
import { CreateOrderSchema, createOrderSchema } from '@/schemas/orders.schema'
import useOrderCreate from '@/hooks/orders/use-order-create'

interface OrderCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderCreate({ open, onOpenChange }: OrderCreateProps) {
  const createOrder = useOrderCreate()

  const form = useForm({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      custumer_id: '',
      pet_id: '',
      order_number: '',
      status: 'draft',
      subtotal: 0,
      tax: 0,
      total: 0,
      paid_amount: 0,
      notes: '',
    },
  })

  const onSubmit = async (data: CreateOrderSchema) => {
    await createOrder.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Orden</DrawerTitle>
          <DrawerDescription>
            Completa la información para crear una nueva orden de venta.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <OrderForm mode="create" />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? 'Creando...' : 'Crear Orden'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createOrder.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

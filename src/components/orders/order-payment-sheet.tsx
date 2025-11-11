'use client'

import { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import useOrderDetail from '@/hooks/orders/use-order-detail'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Tables } from '@/types/supabase.types'
import { POSPayment } from './pos/pos-payment'
import { Button } from '../ui/button'
import { Field } from '../ui/field'
import usePaymentCreateBulk from '@/hooks/payments/use-payment-create-bulk'

interface OrderPaymentSheetProps {
  order: Tables<'orders'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderPaymentSheet({
  order,
  open,
  onOpenChange,
}: OrderPaymentSheetProps) {
  const { clearAll, setOrderData, getOrderData } = usePOSStore()

  const { data, error } = useOrderDetail(order.id)
  const paymentsCreate = usePaymentCreateBulk()

  useEffect(() => {
    if (open && data) {
      // Limpiar el carrito actual
      clearAll()
      if (data) {
        setOrderData(data)
      }
    }
  }, [open, data, clearAll, setOrderData])

  const handleCancel = () => {
    onOpenChange(false)
    clearAll()
  }

  const onSubmit = async () => {
    const { payments } = getOrderData()
    await paymentsCreate.mutateAsync(
      payments.map((payment) => ({
        ...payment,
        order_id: order.id,
      }))
    )
    handleCancel()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-full" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Pagar Orden {order.order_number}</SheetTitle>
        </SheetHeader>
        <POSPayment />
        <SheetFooter>
          <Field orientation="horizontal">
            <Button
              type="submit"
              size="lg"
              onClick={onSubmit}
              disabled={paymentsCreate.isPending}
            >
              {paymentsCreate.isPending ? 'Guardando...' : 'Guardar pagos'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={paymentsCreate.isPending}
            >
              Cancelar
            </Button>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

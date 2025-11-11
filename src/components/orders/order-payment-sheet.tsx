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
  const { clearAll, setOrderData } = usePOSStore()

  const { data, error } = useOrderDetail(order.id)
  const paymentsCreate = useEffect(() => {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-full" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Pagar Orden {order.order_number}</SheetTitle>
        </SheetHeader>
        <POSPayment />
        <SheetFooter>
          <Field orientation="horizontal">
            <Button type="submit" size="lg">
              Guardar pagos
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

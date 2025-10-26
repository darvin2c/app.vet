'use client'

import { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tables } from '@/types/supabase.types'
import { POSPayment } from './pos/pos-payment'
import { usePOSStore } from '@/hooks/pos/use-pos-store'

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
  const { clearCart } = usePOSStore()

  useEffect(() => {
    if (open && order) {
      // Limpiar el carrito actual
      clearCart()

      // TODO: Cargar datos de la orden existente para pagos adicionales
      // Esto requeriría modificar el store POS para manejar órdenes existentes
      console.log('Cargando orden para pago:', order)
    }
  }, [open, order, clearCart])

  const handlePaymentCompleted = () => {
    // Cerrar el sheet cuando se completa el pago
    onOpenChange(false)
  }

  const handleClose = () => {
    // Limpiar el carrito al cerrar
    clearCart()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md p-0" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Pagar Orden {order.order_number}</SheetTitle>
        </SheetHeader>
        <div className="h-full">
          <POSPayment onBack={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

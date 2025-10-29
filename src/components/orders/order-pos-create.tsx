'use client'

import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { POSInterface } from './pos/pos-interface'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface OrderPosCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderPosCreate({ open, onOpenChange }: OrderPosCreateProps) {
  const isMobile = useIsMobile()

  const { clearCart, clearPayments, setSelectedCustomer } = usePOSStore()

  // Limpiar el POS store cuando se abre el sheet de crear orden
  useEffect(() => {
    if (open) {
      clearCart()
      clearPayments()
      setSelectedCustomer(null)
    }
  }, [open, clearCart, clearPayments, setSelectedCustomer])

  const handleOrderCreated = () => {
    // Cerrar el modal POS cuando se crea la orden
    onOpenChange(false)
  }

  const handleClose = () => {
    // Cerrar el modal POS
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="!h-screen !max-w-full !w-full p-0 border-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Punto de Venta</SheetTitle>
        </SheetHeader>
        <POSInterface
          onOrderCreated={handleOrderCreated}
          onClose={handleClose}
        />
      </SheetContent>
    </Sheet>
  )
}

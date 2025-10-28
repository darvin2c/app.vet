'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { POSInterface } from './pos/pos-interface'
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

'use client'

import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { POSInterface } from './pos/pos-interface'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Footer } from 'react-day-picker'
import { Field } from '../ui/field'
import { Button } from '../ui/button'

interface OrderPosCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderPosCreate({ open, onOpenChange }: OrderPosCreateProps) {
  const isMobile = useIsMobile()

  const { clearAll } = usePOSStore()

  // Limpiar el POS store cuando se abre el sheet de crear orden
  useEffect(() => {
    if (open) {
      clearAll()
    }
  }, [open, clearAll])

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
        <POSInterface onClose={handleClose} />
        <SheetFooter>
          <Field>
            <Button onClick={handleOrderCreated}>Guardar Orden</Button>
          </Field>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

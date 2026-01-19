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
import { Field } from '../ui/field'
import { Button } from '../ui/button'
import useOrderCreate from '@/hooks/orders/use-order-create'
import CanAccess from '@/components/ui/can-access'

interface OrderPosCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderPosCreate({ open, onOpenChange }: OrderPosCreateProps) {
  const isMobile = useIsMobile()

  const { clearAll, currentView, getOrderData } = usePOSStore()
  const orderCreate = useOrderCreate()

  // Limpiar el POS store cuando se abre el sheet de crear orden
  useEffect(() => {
    if (open) {
      clearAll()
    }
  }, [open, clearAll])

  const handleClose = () => {
    // Cerrar el modal POS cuando se crea la orden
    onOpenChange(false)
    clearAll()
  }

  const onSubmit = async () => {
    // Cerrar el modal POS
    const data = getOrderData()
    try {
      await orderCreate.mutateAsync({
        order: data.order,
        items: data.orderItems,
        payments: data.payments,
      })
      handleClose()
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="!h-screen !max-w-full !w-full p-0 border-0"
      >
        <CanAccess resource="orders" action="create">
          <SheetHeader className="sr-only">
            <SheetTitle>Punto de Venta</SheetTitle>
          </SheetHeader>
          <POSInterface onClose={handleClose} />
          {currentView === 'payment' && (
            <SheetFooter className="fixed bottom-0 left-0  p-4 bg-background">
              <Field orientation="horizontal">
                <Button size="lg" onClick={onSubmit}>
                  Guardar Orden
                </Button>
                <Button variant="outline" size="lg" onClick={handleClose}>
                  Cancelar
                </Button>
              </Field>
            </SheetFooter>
          )}
        </CanAccess>
      </SheetContent>
    </Sheet>
  )
}

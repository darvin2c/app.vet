'use client'

import { useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tables } from '@/types/supabase.types'
import { POSInterface } from './pos/pos-interface'
import { usePOSStore } from '@/hooks/pos/use-pos-store'

interface OrderEditSheetProps {
  order: Tables<'orders'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderEditSheet({
  order,
  open,
  onOpenChange,
}: OrderEditSheetProps) {
  const { clearCart, setSelectedCustomer, addToCart } = usePOSStore()

  useEffect(() => {
    if (open && order) {
      // Limpiar el carrito actual
      clearCart()

      // TODO: Cargar datos de la orden en el store POS
      // Esto requeriría:
      // 1. Cargar el cliente de la orden
      // 2. Cargar los items de la orden
      // 3. Cargar los pagos existentes

      // Por ahora, solo establecemos un estado básico
      console.log('Cargando orden para editar:', order)
    }
  }, [open, order, clearCart, setSelectedCustomer, addToCart])

  const handleOrderUpdated = () => {
    // Cerrar el sheet cuando se actualiza la orden
    onOpenChange(false)
  }

  const handleClose = () => {
    // Limpiar el carrito al cerrar
    clearCart()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-none p-0" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Editar Orden {order.order_number}</SheetTitle>
        </SheetHeader>
        <div className="h-full">
          <POSInterface
            onOrderCreated={handleOrderUpdated}
            onClose={handleClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

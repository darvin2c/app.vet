'use client'

import { useEffect } from 'react'
import { Tables } from '@/types/supabase.types'
import { POSInterface } from './pos/pos-interface'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useOrderDetail from '@/hooks/orders/use-order-detail'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface OrderEditProps {
  order: Tables<'orders'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderEdit({ order, open, onOpenChange }: OrderEditProps) {
  const { data } = useOrderDetail(order.id)
  const isMobile = useIsMobile()

  const { clearAll, setOrderData } = usePOSStore()

  // Cargar datos de la orden existente al POS store
  useEffect(() => {
    if (data && open) {
      // Limpiar el store antes de cargar los datos
      clearAll()

      setOrderData(data)
    }
  }, [data, open, clearAll, setOrderData])

  const handleOrderUpdated = () => {
    // Cerrar cuando se actualiza la orden
    handleClose()
  }

  const handleClose = () => {
    // Limpiar el store al cerrar
    clearAll()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="!h-screen !max-w-full !w-full p-0 border-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Editar Orden</SheetTitle>
        </SheetHeader>
        <POSInterface
          onOrderCreated={handleOrderUpdated}
          onClose={handleClose}
        />
      </SheetContent>
    </Sheet>
  )
}

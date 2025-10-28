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

  const {
    clearCart,
    clearPayments,
    setSelectedCustomer,
    addToCart,
    addPayment,
    updateCartItemPrice,
  } = usePOSStore()

  // Cargar datos de la orden existente al POS store
  useEffect(() => {
    if (data && open) {
      // Limpiar el store antes de cargar los datos
      clearCart()
      clearPayments()

      // Cargar customer
      if (data.customer) {
        setSelectedCustomer(data.customer)
      }

      // Cargar items al carrito
      if (data.items && data.items.length > 0) {
        data.items.forEach((item: any) => {
          if (item.products) {
            // Agregar el producto al carrito con la cantidad y precio de la orden
            addToCart(item.products, item.quantity)

            // Si el precio es diferente al precio del producto, actualizarlo
            if (item.unit_price !== item.products.price) {
              updateCartItemPrice(item.products.id, item.unit_price)
            }
          }
        })
      }

      // Cargar payments existentes
      if (data.payments && data.payments.length > 0) {
        data.payments.forEach((payment: any) => {
          addPayment({
            payment_method_id: payment.payment_method_id,
            amount: payment.amount,
            notes: payment.notes || '',
            payment_date: payment.payment_date,
          })
        })
      }
    }
  }, [
    data,
    open,
    clearCart,
    clearPayments,
    setSelectedCustomer,
    addToCart,
    addPayment,
    updateCartItemPrice,
  ])

  const handleOrderUpdated = () => {
    // Cerrar cuando se actualiza la orden
    onOpenChange(false)
  }

  const handleClose = () => {
    // Limpiar el carrito al cerrar
    clearCart()
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

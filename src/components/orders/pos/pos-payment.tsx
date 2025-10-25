'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CreditCard,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import { PaymentMethodSelector } from '@/components/pos/payment-method-selector'
import { PaymentTable } from '@/components/pos/payment-table'
import { PaymentSummary } from '@/components/pos/payment-summary'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useOrderCreate from '@/hooks/orders/use-order-create'
import { toast } from 'sonner'

interface POSPaymentProps {
  onBack: () => void
}

export function POSPayment({ onBack }: POSPaymentProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const {
    cartItems,
    cartTotal,
    payments,
    selectedCustomer,
    clearCart,
    remainingAmount,
  } = usePOSStore()

  const { mutate: createOrder, isPending } = useOrderCreate()

  const handlePaymentAdded = () => {
    setIsSheetOpen(false)
    toast.success('Pago agregado correctamente')
  }

  const handleCompleteOrder = () => {
    if (remainingAmount > 0) {
      toast.error('Debe completar el pago antes de finalizar la orden')
      return
    }

    if (cartItems.length === 0) {
      toast.error('No hay productos en el carrito')
      return
    }

    // Calcular subtotal y tax
    const subtotal = cartTotal
    const tax = 0 // Por ahora sin impuestos
    const total = subtotal + tax
    const paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0)

    const orderData = {
      custumer_id: selectedCustomer?.id || '',
      subtotal: subtotal,
      tax: tax,
      total: total,
      paid_amount: paid_amount,
      status: 'paid' as const,
      notes: '',
    }

    createOrder(orderData, {
      onSuccess: () => {
        toast.success('Orden completada exitosamente')
        clearCart()
        onBack()
      },
      onError: (error) => {
        console.error('Error creating order:', error)
        toast.error('Error al crear la orden')
      },
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Procesar Pago</h2>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {cartItems.length} productos
        </div>
      </div>

      {/* Payment Summary - Compact Header */}
      <PaymentSummary
        cartSubtotal={cartTotal}
        cartTax={0}
        cartTotal={cartTotal}
        totalPaid={payments.reduce((sum, payment) => sum + payment.amount, 0)}
        remainingAmount={remainingAmount}
        changeAmount={remainingAmount < 0 ? Math.abs(remainingAmount) : 0}
        paymentsCount={payments.length}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 h-full">
          {/* Left Column: Payment History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <h3 className="font-medium">Historial de Pagos</h3>
            </div>
            <div className="border rounded-lg overflow-hidden">
               <ScrollArea className="h-[400px]">
                 <PaymentTable />
               </ScrollArea>
             </div>
          </div>

          {/* Right Column: Payment Method Selector (Desktop/Tablet only) */}
          <div className="hidden lg:block">
            <PaymentMethodSelector />
          </div>
        </div>
      </div>

      {/* Mobile: Bottom Action Bar (if needed for complete order) */}
      <div className="lg:hidden border-t bg-background p-4">
        <div className="flex gap-3">
          <Button
            onClick={handleCompleteOrder}
            disabled={remainingAmount > 0 || isPending}
            className="flex-1 h-12"
            size="lg"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Completar Orden
          </Button>
        </div>
      </div>

      {/* Desktop: Complete Order Button */}
      <div className="hidden lg:block border-t p-4">
        <div className="flex justify-end">
          <Button
            onClick={handleCompleteOrder}
            disabled={remainingAmount > 0 || isPending}
            size="lg"
            className="min-w-[200px]"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Completar Orden
          </Button>
        </div>
      </div>
    </div>
  )
}

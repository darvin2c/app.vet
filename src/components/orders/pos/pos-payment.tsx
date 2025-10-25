'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CreditCard,
  ShoppingCart,
  CheckCircle,
  AlertTriangle,
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
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    cartItems,
    cartTotal,
    cartSubtotal,
    cartTax,
    payments,
    totalPaid,
    remainingAmount,
    changeAmount,
    clearCart,
    clearPayments,
  } = usePOSStore()

  const { mutate: createOrder } = useOrderCreate()

  const canCompleteOrder = remainingAmount <= 0 && payments.length > 0
  const hasOverpayment = remainingAmount < 0

  const handleCompleteOrder = async () => {
    if (!canCompleteOrder) {
      toast.error('Completa todos los pagos antes de finalizar la orden')
      return
    }

    setIsProcessing(true)

    try {
      // Preparar datos de la orden
      const orderData = {
        custumer_id: 'temp-customer-id', // TODO: Implementar selección de cliente
        subtotal: cartSubtotal,
        tax: cartTax,
        total: cartTotal,
        paid_amount: totalPaid,
        status: 'paid' as const,
        notes: 'Orden creada desde POS',
      }

      createOrder(orderData, {
        onSuccess: () => {
          toast.success('Orden completada exitosamente')
          clearCart()
          clearPayments()
          onBack()
        },
        onError: (error: any) => {
          console.error('Error creating order:', error)
          toast.error('Error al crear la orden')
        },
      })
    } catch (error) {
      console.error('Error completing order:', error)
      toast.error('Error al completar la orden')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearPayments = () => {
    clearPayments()
    toast.success('Pagos eliminados')
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground mb-2">
          Carrito vacío
        </h2>
        <p className="text-muted-foreground mb-6">
          Agrega productos al carrito para proceder con el pago
        </p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al POS
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main Content - Responsive Layout */}
      <div>
        <PaymentSummary
          cartSubtotal={cartSubtotal}
          cartTax={cartTax}
          cartTotal={cartTotal}
          totalPaid={totalPaid}
          remainingAmount={remainingAmount}
          changeAmount={changeAmount}
          paymentsCount={payments.length}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6">
          {/* Left Column - Payment Methods & Table */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
            <div className="space-y-6 p-4 lg:p-0">
              {/* Payment Table */}
              <PaymentTable />

              {/* Clear Payments Button - Mobile */}
              {payments.length > 0 && (
                <div className="lg:hidden">
                  <Button
                    variant="outline"
                    onClick={handleClearPayments}
                    className="w-full"
                  >
                    Limpiar Pagos
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
            {/* Payment Method Selector */}
            <PaymentMethodSelector />
          </div>
        </div>
      </div>
    </div>
  )
}

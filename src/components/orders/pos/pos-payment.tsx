'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  CheckCircle,
  Loader2,
  Save,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { PaymentMethodSelector } from '@/components/orders/pos/payment-method-selector'
import { PaymentTable } from '@/components/orders/pos/payment-table'
import { PaymentSummary } from '@/components/orders/pos/payment-summary'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useOrderCreate from '@/hooks/orders/use-order-create'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

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
    totalPaid,
    paymentStatus,
    getOrderData,
    canSaveWithoutPayment,
    canSaveWithPartialPayment,
    canSaveWithFullPayment,
    getPaymentStatusInfo,
  } = usePOSStore()

  const { mutate: createOrder, isPending } = useOrderCreate()

  const handlePaymentAdded = () => {
    setIsSheetOpen(false)
    toast.success('Pago agregado correctamente')
  }

  // Función unificada para guardar orden
  const handleSaveOrder = (saveType: 'draft' | 'partial' | 'complete') => {
    // Crear datos de la orden
    const orderData = getOrderData()

    // Preparar items de la orden (sin order_id y tenant_id, se agregan en el hook)
    const orderItems = cartItems.map((item) => ({
      product_id: item.product.id,
      description: item.product.name,
      quantity: item.quantity,
      unit_price: item.price,
      discount: 0,
      tax_rate: 0.18,
      total: item.subtotal,
      order_id: '', // Se asignará en el hook
      tenant_id: '', // Se asignará en el hook
    }))

    // Preparar pagos de la orden (sin order_id y tenant_id, se agregan en el hook)
    const orderPayments = payments.map((payment) => ({
      amount: payment.amount,
      customer_id: selectedCustomer?.id,
      payment_method_id: payment.payment_method_id,
      payment_date: payment.payment_date,
      notes: payment.notes,
      order_id: '', // Se asignará en el hook
      tenant_id: '', // Se asignará en el hook
    }))

    const createOrderData = {
      order: {
        ...orderData,
        custumer_id: selectedCustomer?.id || null,
      },
      items: orderItems,
      payments: orderPayments,
    }

    // Ejecutar la creación de la orden
    createOrder(createOrderData, {
      onSuccess: () => {
        clearCart()
        onBack()
      },
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Payment Summary - Compact Header */}
      <PaymentSummary
        cartSubtotal={cartTotal}
        cartTax={0}
        cartTotal={cartTotal}
        totalPaid={totalPaid}
        remainingAmount={remainingAmount}
        changeAmount={remainingAmount < 0 ? Math.abs(remainingAmount) : 0}
        paymentsCount={payments.length}
      />
      <Separator />
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 h-full">
          {/* Left Column: Payment History */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <h3 className="font-medium">Historial de Pagos</h3>
              {remainingAmount > 0 && (
                <Badge variant="outline" className="text-xs">
                  Pendiente: S/ {remainingAmount.toFixed(2)}
                </Badge>
              )}
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

      {/* Mobile: Bottom Action Bar */}
      <div className="lg:hidden border-t bg-background p-4">
        <div className="flex gap-2">
          {/* Guardar sin pago */}
          <Button
            variant="outline"
            onClick={() => handleSaveOrder('draft')}
            disabled={!canSaveWithoutPayment() || isPending}
            className="flex-1 h-12"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>

          {/* Pago parcial (solo si hay pagos) */}
          {canSaveWithPartialPayment() && (
            <Button
              variant="secondary"
              onClick={() => handleSaveOrder('partial')}
              disabled={isPending}
              className="flex-1 h-12"
              size="lg"
            >
              <Clock className="h-4 w-4 mr-2" />
              Parcial
            </Button>
          )}

          {/* Completar orden */}
          <Button
            onClick={() => handleSaveOrder('complete')}
            disabled={!canSaveWithFullPayment() || isPending}
            className="flex-1 h-12"
            size="lg"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Completar
          </Button>
        </div>
      </div>

      {/* Desktop: Action Buttons */}
      <div className="hidden lg:block border-t p-4">
        <div className="flex justify-between items-center">
          {/* Información de balance */}
          <div className="flex items-center gap-4">
            {remainingAmount > 0 && (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Balance pendiente: S/ {remainingAmount.toFixed(2)}
                </span>
              </div>
            )}
            {paymentStatus === 'completed' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Pago completo</span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            {/* Completar orden */}
            <Button
              onClick={() => handleSaveOrder('complete')}
              disabled={isPending}
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
    </div>
  )
}

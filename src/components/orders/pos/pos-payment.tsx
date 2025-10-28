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
  AlertCircle,
  CreditCard,
} from 'lucide-react'
import { PaymentMethodSelector } from '@/components/orders/pos/payment-method-selector'
import { PaymentTable } from '@/components/orders/pos/payment-table'
import { PaymentSummary } from '@/components/orders/pos/payment-summary'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useOrderCreate from '@/hooks/orders/use-order-create'
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

  // Función unificada para guardar orden
  const handleSaveOrder = () => {
    // Crear datos de la orden
    const orderData = getOrderData()

    // Preparar items de la orden (sin order_id y tenant_id, se agregan en el hook)
    const orderItems = cartItems.map((item) => ({
      product_id: item.product.id,
      description: item.product.name,
      quantity: item.quantity,
      unit_price: item.price,
      discount: 0,
      total: item.subtotal,
      price_base: item.price,
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
        customer_id: selectedCustomer?.id || null,
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

  // Determinar el estado del botón según el pago
  const getButtonConfig = () => {
    if (totalPaid === 0) {
      return {
        text: 'Guardar sin Pago',
        icon: Save,
        variant: 'outline' as const,
        className: 'border-amber-200 text-amber-700 hover:bg-amber-50',
        canSave: canSaveWithoutPayment(),
      }
    } else if (totalPaid > 0 && totalPaid < cartTotal) {
      return {
        text: 'Guardar con Pago Parcial',
        icon: CreditCard,
        variant: 'default' as const,
        className: 'bg-orange-600 hover:bg-orange-700',
        canSave: canSaveWithPartialPayment(),
      }
    } else {
      return {
        text: 'Completar Orden',
        icon: CheckCircle,
        variant: 'default' as const,
        className: 'bg-green-600 hover:bg-green-700',
        canSave: canSaveWithFullPayment(),
      }
    }
  }

  const buttonConfig = getButtonConfig()
  const ButtonIcon = buttonConfig.icon

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
          <Button
            variant={buttonConfig.variant}
            onClick={() => handleSaveOrder()}
            disabled={isPending || !buttonConfig.canSave}
            className={`flex-1 h-12 ${buttonConfig.className}`}
            size="lg"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ButtonIcon className="h-4 w-4 mr-2" />
            )}
            {buttonConfig.text}
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

          {/* Botón de acción único */}
          <div className="flex gap-3">
            <Button
              variant={buttonConfig.variant}
              onClick={() => handleSaveOrder()}
              disabled={isPending || !buttonConfig.canSave}
              size="lg"
              className={`min-w-[200px] ${buttonConfig.className}`}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ButtonIcon className="h-4 w-4 mr-2" />
              )}
              {buttonConfig.text}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

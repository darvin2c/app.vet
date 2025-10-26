'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  ShoppingCart,
  CheckCircle,
  ArrowLeft,
  Loader2,
  Save,
  Clock,
  AlertCircle,
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

  // Función para guardar sin pago (estado draft)
  const handleSaveWithoutPayment = () => {
    if (!canSaveWithoutPayment()) {
      toast.error('No se puede guardar la orden sin productos o cliente')
      return
    }

    if (!selectedCustomer?.id) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    const orderData = {
      ...getOrderData(),
      custumer_id: selectedCustomer.id,
      status: 'draft' as const,
    }

    createOrder(orderData, {
      onSuccess: () => {
        toast.success('Orden guardada como borrador')
        clearCart()
        onBack()
      },
      onError: (error) => {
        console.error('Error creating order:', error)
        toast.error('Error al guardar la orden')
      },
    })
  }

  // Función para guardar con pago parcial (estado confirmed)
  const handleSaveWithPartialPayment = () => {
    if (!canSaveWithPartialPayment()) {
      toast.error('No hay pagos parciales para guardar')
      return
    }

    if (!selectedCustomer?.id) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    const orderData = {
      ...getOrderData(),
      custumer_id: selectedCustomer.id,
      status: 'confirmed' as const,
    }

    createOrder(orderData, {
      onSuccess: () => {
        toast.success('Orden guardada con pago parcial')
        clearCart()
        onBack()
      },
      onError: (error) => {
        console.error('Error creating order:', error)
        toast.error('Error al guardar la orden')
      },
    })
  }

  // Función para completar orden (estado paid)
  const handleCompleteOrder = () => {
    if (!canSaveWithFullPayment()) {
      toast.error('Debe completar el pago antes de finalizar la orden')
      return
    }

    if (!selectedCustomer?.id) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    const orderData = {
      ...getOrderData(),
      custumer_id: selectedCustomer.id,
      status: 'paid' as const,
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

  // Obtener información del estado de pago para mostrar indicadores
  const paymentStatusInfo = getPaymentStatusInfo()

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
          {/* Indicador de estado de pago */}
          <Badge 
            variant={paymentStatusInfo.statusOption?.variant || 'secondary'}
            className="ml-2"
          >
            {paymentStatusInfo.statusOption?.icon}
            <span className="ml-1">{paymentStatusInfo.statusOption?.label}</span>
          </Badge>
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
        totalPaid={totalPaid}
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
            onClick={handleSaveWithoutPayment}
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
              onClick={handleSaveWithPartialPayment}
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
            onClick={handleCompleteOrder}
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
            {/* Guardar sin pago */}
            <Button
              variant="outline"
              onClick={handleSaveWithoutPayment}
              disabled={!canSaveWithoutPayment() || isPending}
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar sin Pago
            </Button>

            {/* Pago parcial (solo si hay pagos) */}
            {canSaveWithPartialPayment() && (
              <Button
                variant="secondary"
                onClick={handleSaveWithPartialPayment}
                disabled={isPending}
                size="lg"
              >
                <Clock className="h-4 w-4 mr-2" />
                Guardar Pago Parcial
              </Button>
            )}

            {/* Completar orden */}
            <Button
              onClick={handleCompleteOrder}
              disabled={!canSaveWithFullPayment() || isPending}
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

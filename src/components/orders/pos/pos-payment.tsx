'use client'

import { useState } from 'react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { usePaymentCreate } from '@/hooks/payments/use-payment-create'
import useOrderCreate from '@/hooks/orders/use-order-create'
import useOrderItemCreate from '@/hooks/orders/use-order-item-create'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { PaymentMethodSelector } from '@/components/pos/payment-method-selector'
import { PaymentTable } from '@/components/pos/payment-table'
import { PaymentSummary } from '@/components/pos/payment-summary'
import { CheckCircle, Calculator, Percent, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'

interface POSPaymentProps {
  onOrderCreated?: () => void
  onClose?: () => void
}

export function POSPayment({ onOrderCreated, onClose }: POSPaymentProps) {
  const [discount, setDiscount] = useState('')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    cartItems,
    selectedCustomer,
    cartTotal,
    cartSubtotal,
    cartTax,
    payments,
    totalPaid,
    remainingAmount,
    changeAmount,
    removePayment,
    clearCart,
    setCurrentView,
    isPaymentComplete,
    canProcessOrder,
  } = usePOSStore()

  const orderCreateMutation = useOrderCreate()
  const orderItemCreateMutation = useOrderItemCreate()
  const paymentCreateMutation = usePaymentCreate()

  // Calculate discount amount
  const discountAmount = discount
    ? (cartSubtotal * parseFloat(discount)) / 100
    : 0
  const finalTotal = cartTotal - discountAmount

  const handleProcessOrder = async () => {
    if (!selectedCustomer) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    if (cartItems.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    if (!isPaymentComplete()) {
      toast.error('El pago no está completo')
      return
    }

    if (payments.length === 0) {
      toast.error('Debe agregar al menos un método de pago')
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const orderData = {
        custumer_id: selectedCustomer!.id,
        status: 'paid' as const,
        subtotal: cartSubtotal,
        tax: cartTax,
        total: finalTotal,
        paid_amount: totalPaid,
        notes: notes || undefined,
      }

      const order = await orderCreateMutation.mutateAsync(orderData)

      // Create order items
      for (const item of cartItems) {
        await orderItemCreateMutation.mutateAsync({
          order_id: order.id,
          product_id: item.product.id,
          description: item.product.name,
          quantity: item.quantity,
          unit_price: item.price,
          discount: 0,
          tax_rate: item.product.tax_rate || 0,
        })
      }

      // Create payment records
      for (const payment of payments) {
        await paymentCreateMutation.mutateAsync({
          amount: payment.amount,
          customer_id: selectedCustomer!.id,
          order_id: order.id,
          payment_method_id: payment.payment_method_id,
          payment_date: payment.payment_date,
          notes: payment.notes,
        })
      }

      toast.success('Venta procesada exitosamente')
      clearCart()
      onOrderCreated?.()
      setCurrentView('catalog')
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error('Error al procesar el pago')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ScrollArea className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Payment Summary */}
        <PaymentSummary
          cartSubtotal={cartSubtotal}
          cartTax={cartTax}
          cartTotal={finalTotal}
          totalPaid={totalPaid}
          remainingAmount={Math.max(0, finalTotal - totalPaid)}
          changeAmount={Math.max(0, totalPaid - finalTotal)}
          paymentsCount={payments.length}
        />

        {/* Discount Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Descuento (Opcional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="discount">Porcentaje de descuento</Label>
              <Input
                id="discount"
                type="number"
                step="0.1"
                min="0"
                max="100"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="text-right"
                disabled={isProcessing}
              />
              {discountAmount > 0 && (
                <div className="text-sm text-green-600">
                  Descuento aplicado: S/ {discountAmount.toFixed(2)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selector */}
        <PaymentMethodSelector />

        {/* Payments Table */}
        <PaymentTable payments={payments} onRemovePayment={removePayment} />

        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Notas (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Agregar notas sobre la venta..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isProcessing}
            />
          </CardContent>
        </Card>

        {/* Validation Messages */}
        {!canProcessOrder() && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <div className="space-y-1">
                  <p className="font-medium">
                    Requisitos para procesar la orden:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    {cartItems.length === 0 && (
                      <li>• Agregar productos al carrito</li>
                    )}
                    {!selectedCustomer && <li>• Seleccionar un cliente</li>}
                    {!isPaymentComplete() && (
                      <li>
                        • Completar el pago (faltan S/{' '}
                        {Math.max(0, finalTotal - totalPaid).toFixed(2)})
                      </li>
                    )}
                    {payments.length === 0 && (
                      <li>• Agregar al menos un método de pago</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer with Process Button */}
      <div className="p-4 border-t bg-gray-50">
        <Button
          onClick={handleProcessOrder}
          disabled={!canProcessOrder() || isProcessing}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Calculator className="h-5 w-5 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Procesar Orden - S/ {finalTotal.toFixed(2)}
              {changeAmount > 0 && (
                <span className="ml-2 text-sm">
                  (Vuelto: S/ {changeAmount.toFixed(2)})
                </span>
              )}
            </>
          )}
        </Button>
      </div>
    </ScrollArea>
  )
}

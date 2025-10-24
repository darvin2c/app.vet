'use client'

import { useState } from 'react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import useOrderCreate from '@/hooks/orders/use-order-create'
import useOrderItemCreate from '@/hooks/orders/use-order-item-create'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CreditCard,
  Banknote,
  Smartphone,
  Calculator,
  Receipt,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Percent,
} from 'lucide-react'
import { toast } from 'sonner'

interface POSPaymentProps {
  onOrderCreated?: () => void
  onClose?: () => void
}

export function POSPayment({ onOrderCreated, onClose }: POSPaymentProps) {
  const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'transfer'>(
    'cash'
  )
  const [amountPaid, setAmountPaid] = useState('')
  const [discount, setDiscount] = useState('')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    cartItems,
    selectedCustomer,
    selectedPet,
    cartTotal,
    cartSubtotal,
    cartTax,
    clearCart,
    setCurrentView,
  } = usePOSStore()

  const orderCreateMutation = useOrderCreate()
  const orderItemCreateMutation = useOrderItemCreate()

  // Calculate discount amount
  const discountAmount = discount ? (cartSubtotal * parseFloat(discount)) / 100 : 0
  const finalTotal = cartTotal - discountAmount
  const change = amountPaid ? Math.max(0, parseFloat(amountPaid) - finalTotal) : 0

  const handlePayment = async () => {
    if (!selectedCustomer) {
      toast.error('Debe seleccionar un cliente')
      return
    }

    if (cartItems.length === 0) {
      toast.error('El carrito está vacío')
      return
    }

    if (!amountPaid || parseFloat(amountPaid) < finalTotal) {
      toast.error('El monto pagado debe ser mayor o igual al total')
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const orderData = {
        custumer_id: selectedCustomer!.id,
        pet_id: selectedPet?.id || undefined,
        status: 'paid' as const,
        subtotal: cartSubtotal,
        tax: cartTax,
        total: finalTotal,
        paid_amount: parseFloat(amountPaid),
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

  const paymentTypeConfig = {
    cash: {
      label: 'Efectivo',
      icon: Banknote,
      color: 'bg-green-600',
    },
    card: {
      label: 'Tarjeta',
      icon: CreditCard,
      color: 'bg-blue-600',
    },
    transfer: {
      label: 'Transferencia',
      icon: Smartphone,
      color: 'bg-purple-600',
    },
  }

  const handleQuickAmount = (percentage: number) => {
    const amount = ((finalTotal * percentage) / 100).toFixed(2)
    setAmountPaid(amount)
  }

  const handleBackToCatalog = () => {
    setCurrentView('catalog')
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToCatalog}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h2 className="text-lg font-semibold">Procesar Pago</h2>
        <div className="w-16" /> {/* Spacer */}
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Resumen de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>S/ {cartSubtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento ({discount}%):</span>
                <span>-S/ {discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Impuestos:</span>
              <span>S/ {cartTax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>S/ {finalTotal.toFixed(2)}</span>
            </div>
            {change > 0 && (
              <div className="flex justify-between text-blue-600 font-medium">
                <span>Vuelto:</span>
                <span>S/ {change.toFixed(2)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(paymentTypeConfig).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={type}
                    variant={paymentType === type ? 'default' : 'outline'}
                    onClick={() => setPaymentType(type as any)}
                    className="h-20 flex-col gap-2"
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{config.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Payment Amount */}
        <Card>
          <CardHeader>
            <CardTitle>Monto Recibido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="text-right text-xl h-12"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickAmount(100)}
              >
                Exacto
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmountPaid((finalTotal + 5).toFixed(2))}
              >
                +S/5
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmountPaid((finalTotal + 10).toFixed(2))}
              >
                +S/10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmountPaid((finalTotal + 20).toFixed(2))}
              >
                +S/20
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Discount */}
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
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notas (Opcional)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Agregar notas sobre la venta..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Footer with Process Button */}
      <div className="p-4 border-t bg-gray-50">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || !amountPaid || parseFloat(amountPaid) < finalTotal}
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
              Procesar Pago - S/ {finalTotal.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

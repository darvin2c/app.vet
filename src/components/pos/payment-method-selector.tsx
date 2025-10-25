'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
  Plus,
  Zap,
  Calculator,
  DollarSign,
} from 'lucide-react'
import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { toast } from 'sonner'

const paymentTypeIcons = {
  cash: Banknote,
  app: Smartphone,
  credit: CreditCard,
  others: MoreHorizontal,
}

const paymentTypeLabels = {
  cash: 'Efectivo',
  app: 'App',
  credit: 'Crédito',
  others: 'Otros',
}

export function PaymentMethodSelector() {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')

  const { data: paymentMethods = [] } = usePaymentMethodList()
  const { addPayment, cartTotal, remainingAmount } = usePOSStore()

  // Auto-seleccionar efectivo por defecto
  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedMethodId) {
      const cashMethod = paymentMethods.find(
        (method) => method.payment_type === 'cash'
      )
      if (cashMethod) {
        setSelectedMethodId(cashMethod.id)
      } else {
        setSelectedMethodId(paymentMethods[0].id)
      }
    }
  }, [paymentMethods, selectedMethodId])

  const selectedMethod = paymentMethods.find(
    (method) => method.id === selectedMethodId
  )

  const handleAddPayment = () => {
    if (!selectedMethodId) {
      toast.error('Selecciona un método de pago')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }

    const paymentAmount = parseFloat(amount)

    if (paymentAmount > remainingAmount && remainingAmount > 0) {
      toast.error(
        `El monto no puede ser mayor al saldo pendiente (S/ ${remainingAmount.toFixed(2)})`
      )
      return
    }

    addPayment({
      payment_method_id: selectedMethodId,
      amount: paymentAmount,
      notes: notes || undefined,
      payment_method: selectedMethod,
      payment_date: new Date().toISOString(),
    })

    // Reset form
    setAmount('')
    setNotes('')

    toast.success('Pago agregado correctamente')
  }

  // Quick Actions
  const handleQuickPayment = (type: 'exact' | 'cash_only' | 'split_half') => {
    const cashMethod = paymentMethods.find(
      (method) => method.payment_type === 'cash'
    )

    switch (type) {
      case 'exact':
        if (remainingAmount > 0) {
          setAmount(remainingAmount.toString())
          if (cashMethod) setSelectedMethodId(cashMethod.id)
        }
        break
      case 'cash_only':
        if (cashMethod && cartTotal > 0) {
          setSelectedMethodId(cashMethod.id)
          setAmount(cartTotal.toString())
        }
        break
      case 'split_half':
        if (remainingAmount > 0) {
          setAmount((remainingAmount / 2).toFixed(2))
          if (cashMethod) setSelectedMethodId(cashMethod.id)
        }
        break
    }
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Agregar Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection - Touch-First */}
        <div className="space-y-3">
          <Label>Método de Pago</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon =
                paymentTypeIcons[
                  method.payment_type as keyof typeof paymentTypeIcons
                ] || MoreHorizontal
              const isSelected = selectedMethodId === method.id

              return (
                <Button
                  key={method.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="h-14 p-4 justify-start transition-all duration-200"
                  onClick={() => setSelectedMethodId(method.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{method.name}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {paymentTypeLabels[
                          method.payment_type as keyof typeof paymentTypeLabels
                        ] || 'Otros'}
                      </Badge>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Amount Input - Mejorado */}
        <div className="space-y-3">
          <Label htmlFor="amount">Monto a Pagar</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-right font-mono text-lg h-12"
          />
        </div>

        {/* Notes - Compacto */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (Opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Agregar notas sobre este pago..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Add Payment Button - Touch-First */}
        <Button
          onClick={handleAddPayment}
          disabled={!selectedMethodId || !amount || parseFloat(amount) <= 0}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar Pago
          {amount && parseFloat(amount) > 0 && (
            <span className="ml-2 font-mono">
              S/ {parseFloat(amount).toFixed(2)}
            </span>
          )}
        </Button>

        {/* Validation Messages */}
        {parseFloat(amount) > remainingAmount && remainingAmount > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Calculator className="h-4 w-4" />
              <span className="text-sm">
                El monto excede el saldo pendiente por S/{' '}
                {(parseFloat(amount) - remainingAmount).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

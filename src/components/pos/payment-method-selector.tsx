'use client'

import { useState } from 'react'
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
    setSelectedMethodId('')

    toast.success('Pago agregado correctamente')
  }

  const quickAmounts = [
    { label: 'Saldo', value: remainingAmount },
    { label: 'S/ 10', value: 10 },
    { label: 'S/ 20', value: 20 },
    { label: 'S/ 50', value: 50 },
    { label: 'S/ 100', value: 100 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Agregar Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Method Selection */}
        <div className="space-y-2">
          <Label>Método de Pago</Label>
          <div className="grid grid-cols-2 gap-2">
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
                  className="h-auto p-3 justify-start"
                  onClick={() => setSelectedMethodId(method.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{method.name}</div>
                      <Badge variant="secondary" className="text-xs">
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

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-right font-mono"
          />

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount.label}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.value.toString())}
                disabled={quickAmount.value <= 0}
              >
                {quickAmount.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (Opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Agregar notas sobre este pago..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        {/* Add Payment Button */}
        <Button
          onClick={handleAddPayment}
          disabled={!selectedMethodId || !amount || parseFloat(amount) <= 0}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pago
        </Button>
      </CardContent>
    </Card>
  )
}

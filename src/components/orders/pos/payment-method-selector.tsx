'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
  Plus,
  Calculator,
} from 'lucide-react'
import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { useIsMobile } from '@/hooks/use-mobile'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

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

interface PaymentMethodSelectorProps {
  onPaymentAdded?: () => void
}

export function PaymentMethodSelector({
  onPaymentAdded,
}: PaymentMethodSelectorProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { data: paymentMethods = [] } = usePaymentMethodList()
  const { addPayment, cartTotal, remainingAmount } = usePOSStore()
  const isMobile = useIsMobile()

  // Memoizar el método de pago por defecto para evitar re-cálculos innecesarios
  const defaultPaymentMethod = useMemo(() => {
    if (paymentMethods.length === 0) return null

    const cashMethod = paymentMethods.find(
      (method) => method.payment_type === 'cash'
    )
    return cashMethod || paymentMethods[0]
  }, [paymentMethods])

  // Auto-seleccionar efectivo por defecto - optimizado para evitar re-renders
  useEffect(() => {
    if (defaultPaymentMethod && !selectedMethodId) {
      setSelectedMethodId(defaultPaymentMethod.id)
    }
  }, [defaultPaymentMethod, selectedMethodId])

  // Memoizar el método seleccionado
  const selectedMethod = useMemo(
    () => paymentMethods.find((method) => method.id === selectedMethodId),
    [paymentMethods, selectedMethodId]
  )

  // Memoizar handlers para evitar re-renders
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(e.target.value)
    },
    []
  )

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotes(e.target.value)
    },
    []
  )

  const handleMethodSelect = useCallback((methodId: string) => {
    setSelectedMethodId(methodId)
  }, [])

  const handleAddPayment = useCallback(() => {
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

    // Close sheet if mobile
    if (isMobile) {
      setIsSheetOpen(false)
    }

    // Call callback if provided
    onPaymentAdded?.()
  }, [
    selectedMethodId,
    amount,
    remainingAmount,
    notes,
    selectedMethod,
    addPayment,
    isMobile,
    onPaymentAdded,
  ])

  // Memoizar el contenido del selector para evitar re-renders innecesarios
  const PaymentSelectorContent = useMemo(
    () => () => (
      <div className="space-y-6">
        {/* Payment Method Selection - Touch-First */}
        <div className="space-y-3">
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
                  onClick={() => handleMethodSelect(method.id)}
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
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
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
            onChange={handleNotesChange}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Add Payment Button - Touch-First */}
        <div className="flex justify-end">
          <Button
            onClick={handleAddPayment}
            disabled={!selectedMethodId || !amount || parseFloat(amount) <= 0}
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
        </div>

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
      </div>
    ),
    [
      paymentMethods,
      selectedMethodId,
      amount,
      notes,
      remainingAmount,
      handleMethodSelect,
      handleAmountChange,
      handleNotesChange,
      handleAddPayment,
    ]
  )

  // Renderizado responsivo
  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader>
            <SheetTitle>Agregar Pago</SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <PaymentSelectorContent />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop/Tablet: Mostrar como Card
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 px-4 py-2">
          <CreditCard className="h-5 w-5" />
          Métodos de Pago
        </div>
      </div>
      <Separator />
      <div>
        <PaymentSelectorContent />
      </div>
    </div>
  )
}

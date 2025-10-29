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
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { ScrollArea } from '@radix-ui/react-scroll-area'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { CurrencyInput } from '@/components/ui/current-input'

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
  onPaymentAdded?: (payment: any) => void
  remainingAmount?: number
}

interface PaymentSelectorContentProps {
  paymentMethods: any[]
  selectedMethodId: string
  amount: string
  notes: string
  remainingAmount: number
  handleMethodSelect: (methodId: string) => void
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleAddPayment: () => void
}

function PaymentSelectorContent({
  paymentMethods,
  selectedMethodId,
  amount,
  notes,
  remainingAmount,
  handleMethodSelect,
  handleAmountChange,
  handleNotesChange,
  handleAddPayment,
}: PaymentSelectorContentProps) {
  const selectedMethod = paymentMethods.find(
    (method) => method.id === selectedMethodId
  )

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (remainingAmount * percentage).toFixed(2)
    handleAmountChange({
      target: { value: quickAmount },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods with Field and RadioGroup */}
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor="payment-method-selector">
            Método de Pago
          </FieldLabel>
          <RadioGroup
            value={selectedMethodId}
            onValueChange={handleMethodSelect}
            data-slot="radio-group"
            className="grid grid-cols-2 gap-4"
          >
            {paymentMethods.map((method) => {
              const Icon =
                paymentTypeIcons[
                  method.payment_type as keyof typeof paymentTypeIcons
                ] || CreditCard

              return (
                <FieldLabel
                  key={method.id}
                  htmlFor={`payment-method-${method.id}`}
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <FieldTitle>{method.name}</FieldTitle>
                      </div>
                      <FieldDescription>
                        {paymentTypeLabels[
                          method.payment_type as keyof typeof paymentTypeLabels
                        ] || 'Otros'}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value={method.id}
                      id={`payment-method-${method.id}`}
                    />
                  </Field>
                </FieldLabel>
              )
            })}
          </RadioGroup>
        </FieldSet>
      </FieldGroup>

      <Separator />

      {/* Amount Input */}
      <div className="space-y-3">
        <div className="relative">
          <CurrencyInput>
            {/* Quick Amount Buttons */}
            {remainingAmount > 0 && (
              <>
                <Separator className="h-full" orientation="vertical" />
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  onClick={() => handleQuickAmount(0.25)}
                  className="h-full"
                >
                  25%
                </InputGroupButton>
                <Separator className="h-full" orientation="vertical" />
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  onClick={() => handleQuickAmount(0.5)}
                  className="h-full"
                >
                  50%
                </InputGroupButton>
                <Separator className="h-full" orientation="vertical" />
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  onClick={() => handleQuickAmount(1)}
                  className="h-full"
                >
                  Total
                </InputGroupButton>
              </>
            )}
          </CurrencyInput>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notas (opcional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Agregar notas del pago..."
          value={notes}
          onChange={handleNotesChange}
          className="min-h-[80px] resize-none"
        />
      </div>

      {/* Add Payment Button */}
      <Button
        onClick={handleAddPayment}
        className="w-full h-12"
        size="sm"
        disabled={!selectedMethodId || !amount || parseFloat(amount) <= 0}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Pago
      </Button>
    </div>
  )
}

export function PaymentMethodSelector({
  onPaymentAdded,
  remainingAmount: propRemainingAmount,
}: PaymentMethodSelectorProps) {
  const [selectedMethodId, setSelectedMethodId] = useState<string>('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { data: paymentMethods = [] } = usePaymentMethodList()

  // Use POS store if no remainingAmount prop is provided (backward compatibility)
  const posStore = usePOSStore()
  const remainingAmount = propRemainingAmount ?? posStore.remainingAmount

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

    const payment = {
      payment_method_id: selectedMethodId,
      amount: paymentAmount,
      notes: notes || undefined,
      payment_method: selectedMethod,
      payment_date: new Date().toISOString(),
    }

    // Use custom callback if provided, otherwise use POS store
    if (onPaymentAdded) {
      onPaymentAdded(payment)
    } else {
      posStore.addPayment(payment)
    }

    // Reset form
    setAmount('')
    setNotes('')

    toast.success('Pago agregado correctamente')

    // Close sheet on mobile
    if (isMobile) {
      setIsSheetOpen(false)
    }
  }, [
    selectedMethodId,
    amount,
    remainingAmount,
    notes,
    selectedMethod,
    onPaymentAdded,
    posStore,
    isMobile,
  ])

  // Auto-fill remaining amount when clicking on amount input
  const handleAmountFocus = useCallback(() => {
    if (!amount && remainingAmount > 0) {
      setAmount(remainingAmount.toFixed(2))
    }
  }, [amount, remainingAmount])

  const contentProps = {
    paymentMethods,
    selectedMethodId,
    amount,
    notes,
    remainingAmount,
    handleMethodSelect,
    handleAmountChange,
    handleNotesChange,
    handleAddPayment,
  }

  // Mobile: Show as Sheet
  if (isMobile) {
    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="w-full h-12" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Pago
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh]">
          <SheetHeader className="pb-4">
            <SheetTitle>Agregar Pago</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto">
            <PaymentSelectorContent {...contentProps} />
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop: Show inline
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        <h3 className="font-medium">Agregar Pago</h3>
        {remainingAmount > 0 && (
          <Badge variant="outline" className="text-xs">
            Pendiente: S/ {remainingAmount.toFixed(2)}
          </Badge>
        )}
      </div>
      <div className="border rounded-lg p-4">
        <PaymentSelectorContent {...contentProps} />
      </div>
    </div>
  )
}

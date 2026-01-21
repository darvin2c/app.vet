'use client'

import { useState } from 'react'
import { useForm, useFormContext, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Plus, Calculator, ChevronDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { InputGroupButton } from '@/components/ui/input-group'
import { Input } from '@/components/ui/input'
import { CurrencyDisplay, CurrencyInput } from '@/components/ui/currency-input'
import { usePaymentType } from '@/hooks/payment-methods/use-payment-type'
import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { posPaymentSchema } from '@/schemas/pos-payment.schema'
import { Form } from '@/components/ui/form'
import { usePagination } from '@/components/ui/pagination'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface PosPaymentSelectorContentProps {
  onPaymentAdded?: () => void
}

export function PosPaymentSelectorContent({
  onPaymentAdded,
}: PosPaymentSelectorContentProps) {
  const form = useFormContext()
  const { appliedPagination } = usePagination()
  const { data, isPending: isLoadingMethods } = usePaymentMethodList({
    pagination: appliedPagination,
  })
  const paymentMethods = data?.data || []
  const { getPaymentType } = usePaymentType()
  const { order, addPayment } = usePOSStore()
  const [isOpen, setIsOpen] = useState(true)

  // Calculate remaining amount from order balance
  const remainingAmount = order?.balance || 0

  const handleQuickAmount = (percentage: number) => {
    if (remainingAmount > 0) {
      const amount = remainingAmount * percentage
      form.setValue('amount', amount)
    }
  }

  const selectedMethodId = form.watch('payment_method_id') || ''
  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId)
  const selectedPaymentType = selectedMethod
    ? getPaymentType(selectedMethod.payment_type)
    : undefined
  const SelectedIcon = selectedPaymentType?.icon

  const onSubmit = form.handleSubmit((data) => {
    // Validación condicional de referencia según método seleccionado
    if (selectedMethod?.ref_required && !String(data.reference || '').trim()) {
      form.setError('reference', {
        type: 'manual',
        message: 'La referencia es requerida para este método de pago',
      })
      return
    }
    // Create payment object for POS store
    const payment = {
      amount: data.amount,
      payment_method_id: data.payment_method_id,
      payment_method: selectedMethod,
      notes: data.notes || null,
      reference: data.reference || null,
      created_by: null,
    }

    addPayment(payment)
    form.reset()
    onPaymentAdded?.()
  })

  if (isLoadingMethods) {
    return <div className="p-4 text-center">Cargando métodos de pago...</div>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Payment Methods */}
      <Field>
        <FieldLabel>Método de Pago</FieldLabel>
        <FieldContent>
          <Collapsible
            open={isOpen}
            className="w-full"
            onOpenChange={(open) => {
              if (open) {
                setIsOpen(true) // Siempre permitir abrir
              } else if (selectedMethod) {
                setIsOpen(false) // Solo cerrar si hay método seleccionado
              }
            }}
          >
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                  <FieldTitle>
                    {selectedMethod?.name || 'Seleccione método'}
                  </FieldTitle>
                  {selectedPaymentType?.label && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedPaymentType.label}
                    </Badge>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <RadioGroup
                value={form.watch('payment_method_id') || ''}
                onValueChange={(value) => {
                  form.setValue('payment_method_id', value)
                  setIsOpen(false)
                }}
                className="grid grid-cols-2 gap-2"
              >
                {paymentMethods.map((method) => {
                  const paymentType = getPaymentType(method.payment_type)
                  const Icon = paymentType?.icon

                  return (
                    <FieldLabel
                      key={method.id}
                      htmlFor={`payment-method-${method.id}`}
                    >
                      <Field orientation="horizontal">
                        <FieldContent>
                          <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            <FieldTitle>{method.name}</FieldTitle>
                          </div>
                          <FieldDescription>
                            {paymentType?.label || 'Otros'}
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
            </CollapsibleContent>
          </Collapsible>
          <FieldError errors={[form.formState.errors.payment_method_id]} />
        </FieldContent>
      </Field>

      {/* Amount Input */}
      <Field>
        <FieldLabel htmlFor="amount">Monto</FieldLabel>
        <FieldContent>
          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <CurrencyInput id="amount" className="w-full" {...field}>
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
            )}
          />
          <FieldError errors={[form.formState.errors.amount]} />
        </FieldContent>
      </Field>

      {/* Reference (conditional) */}
      {selectedMethod?.ref_required && (
        <Field>
          <FieldLabel htmlFor="reference">Referencia</FieldLabel>
          <FieldContent>
            <Input
              id="reference"
              placeholder="Ingresa la referencia del pago"
              {...form.register('reference')}
            />
            <FieldDescription>
              Este método requiere una referencia para registrar el pago.
            </FieldDescription>
            <FieldError errors={[form.formState.errors.reference]} />
          </FieldContent>
        </Field>
      )}

      {/* Notes */}
      <Field>
        <FieldLabel htmlFor="notes">Notas (opcional)</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Agregar notas del pago..."
            {...form.register('notes')}
            className="min-h-[80px] resize-none"
          />
          <FieldError errors={[form.formState.errors.notes]} />
        </FieldContent>
      </Field>

      {/* Add Payment Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          type="submit"
          size="sm"
          disabled={form.formState.isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pago
        </Button>
      </div>
    </form>
  )
}

export function PosPaymentMethodSelector({
  onPaymentAdded,
}: {
  onPaymentAdded?: () => void
}) {
  const { order } = usePOSStore()

  const form = useForm({
    resolver: zodResolver(posPaymentSchema),
    defaultValues: {
      payment_method_id: '',
      amount: 0,
      reference: '',
      notes: '',
    },
  })

  // Desktop: Show inline
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-4 w-4" />
        <h3 className="font-medium">Agregar Pago</h3>
        {order?.balance && (
          <Badge variant="outline" className="text-xs">
            Pendiente: <CurrencyDisplay value={order?.balance || 0} />
          </Badge>
        )}
      </div>
      <div>
        <Form {...form}>
          <PosPaymentSelectorContent onPaymentAdded={onPaymentAdded} />
        </Form>
      </div>
    </div>
  )
}

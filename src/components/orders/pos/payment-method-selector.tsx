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
import { useIsMobile } from '@/hooks/use-mobile'
import { Separator } from '@/components/ui/separator'
import { InputGroupButton } from '@/components/ui/input-group'
import { CurrencyInput } from '@/components/ui/current-input'

function PaymentSelectorContent() {
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
          <CurrencyInput
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            className="w-full"
          >
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
      <div className="flex justify-end">
        <Button
          onClick={handleAddPayment}
          size="sm"
          disabled={!selectedMethodId || !amount || parseFloat(amount) <= 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pago
        </Button>
      </div>
    </div>
  )
}

export function PaymentMethodSelector() {
  const isMobile = useIsMobile()

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

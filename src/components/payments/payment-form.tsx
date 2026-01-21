'use client'

import { useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PaymentFormData } from '@/schemas/payments.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { DatePicker } from '@/components/ui/date-picker'
import { PaymentMethodSelect } from '@/components/payment-methods/payment-method-select'
import { CustomerSelect } from '@/components/customers/customer-select'
import { OrderSelect } from '@/components/orders/order-select'
import { Tables } from '@/types/supabase.types'

type Payment = Tables<'payments'>

export function PaymentForm({
  mode,
  payment,
}: {
  mode: 'create' | 'update'
  payment?: Payment
}) {
  const form = useFormContext<PaymentFormData>()
  const {
    formState: { errors },
    setValue,
  } = form

  return (
    <div className="space-y-4 p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="amount">Monto *</FieldLabel>
          <FieldContent>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              disabled={mode === 'update'}
              value={mode === 'update' && payment ? payment.amount : undefined}
              {...form.register('amount', {
                valueAsNumber: true,
                setValueAs: (value) => (value === '' ? 0 : Number(value)),
              })}
            />
            <FieldError errors={[errors.amount]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="payment_date">Fecha de Pago *</FieldLabel>
          <FieldContent>
            <DatePicker
              id="payment_date"
              name="payment_date"
              value={form.watch('payment_date')}
              onChange={(date) =>
                setValue('payment_date', date?.toISOString() || '')
              }
              disabled={mode === 'update'}
            />
            <FieldError errors={[errors.payment_date]} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="payment_method_id">Método de Pago *</FieldLabel>
          <FieldContent>
            <PaymentMethodSelect
              value={
                mode === 'update' && payment
                  ? payment.payment_method_id
                  : form.watch('payment_method_id') || ''
              }
              onValueChange={(value) => setValue('payment_method_id', value)}
              placeholder="Seleccionar método..."
              disabled={mode === 'update'}
            />
            <FieldError errors={[errors.payment_method_id]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="customer_id">Cliente</FieldLabel>
          <FieldContent>
            <CustomerSelect
              value={
                mode === 'update' && payment
                  ? payment.customer_id || ''
                  : form.watch('customer_id') || ''
              }
              onValueChange={(value) => setValue('customer_id', value || null)}
              placeholder="Seleccionar cliente..."
              disabled={mode === 'update'}
            />
            <FieldError errors={[errors.customer_id]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="order_id">Orden Relacionada</FieldLabel>
        <FieldContent>
          <OrderSelect
            value={
              mode === 'update' && payment
                ? payment.order_id || ''
                : form.watch('order_id') || ''
            }
            onValueChange={(value) => setValue('order_id', value || null)}
            placeholder="Seleccionar orden..."
            disabled={mode === 'update'}
          />
          <FieldError errors={[errors.order_id]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="reference">Referencia</FieldLabel>
        <FieldContent>
          <Input
            id="reference"
            placeholder="Número de transacción, factura, etc."
            {...form.register('reference')}
          />
          <FieldError errors={[errors.reference]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="notes">Notas</FieldLabel>
        <FieldContent>
          <Textarea
            id="notes"
            placeholder="Observaciones adicionales..."
            className="resize-none"
            rows={3}
            {...form.register('notes')}
          />
          <FieldError errors={[errors.notes]} />
        </FieldContent>
      </Field>
    </div>
  )
}

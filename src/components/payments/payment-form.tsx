'use client'

import { useFormContext } from 'react-hook-form'
import { PaymentFormData } from '@/schemas/payments.schema'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { DatePicker } from '@/components/ui/date-picker'
import { PaymentMethodSelect } from '@/components/payment-methods/payment-method-select'
import { CustomerSelect } from '@/components/customers/customer-select'
import { OrderSelect } from '@/components/orders/order-select'
import { Tables } from '@/types/supabase.types'
import { CurrencyInput } from '@/components/ui/currency-input'

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
    watch,
    register,
  } = form

  const amount = mode === 'update' && payment ? payment.amount : watch('amount')

  return (
    <div className="space-y-8">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="customer_id">Cliente</FieldLabel>
            <FieldContent>
              <CustomerSelect
                value={
                  mode === 'update' && payment
                    ? payment.customer_id || ''
                    : watch('customer_id') || ''
                }
                onValueChange={(value) =>
                  setValue('customer_id', value || null)
                }
                placeholder="Seleccionar cliente..."
                disabled={mode === 'update'}
              />
              <FieldDescription>
                Cliente asociado al pago (opcional).
              </FieldDescription>
              <FieldError errors={[errors.customer_id]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="order_id">Orden Relacionada</FieldLabel>
            <FieldContent>
              <OrderSelect
                value={
                  mode === 'update' && payment
                    ? payment.order_id || ''
                    : watch('order_id') || ''
                }
                onValueChange={(value) => setValue('order_id', value || null)}
                placeholder="Seleccionar orden..."
                disabled={mode === 'update'}
              />
              <FieldDescription>
                Orden de venta relacionada (opcional).
              </FieldDescription>
              <FieldError errors={[errors.order_id]} />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend>Detalles del Pago</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="amount">Monto *</FieldLabel>
            <FieldContent>
              <CurrencyInput
                id="amount"
                placeholder="0.00"
                disabled={mode === 'update'}
                value={amount}
                onChange={(value) => setValue('amount', value || 0)}
              />
              <FieldDescription>
                El monto total del pago recibido.
              </FieldDescription>
              <FieldError errors={[errors.amount]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="payment_date">Fecha de Pago *</FieldLabel>
            <FieldContent>
              <DatePicker
                id="payment_date"
                name="payment_date"
                value={watch('payment_date')}
                onChange={(date) =>
                  setValue('payment_date', date?.toISOString() || '')
                }
                disabled={mode === 'update'}
              />
              <FieldDescription>
                Fecha en que se realizó la transacción.
              </FieldDescription>
              <FieldError errors={[errors.payment_date]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="payment_method_id">
              Método de Pago *
            </FieldLabel>
            <FieldContent>
              <PaymentMethodSelect
                value={
                  mode === 'update' && payment
                    ? payment.payment_method_id
                    : watch('payment_method_id') || ''
                }
                onValueChange={(value) => setValue('payment_method_id', value)}
                placeholder="Seleccionar método..."
              />
              <FieldError errors={[errors.payment_method_id]} />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Información Adicional</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="reference">Referencia</FieldLabel>
            <FieldContent>
              <Input
                id="reference"
                placeholder="Número de transacción, factura, etc."
                {...register('reference')}
              />
              <FieldDescription>
                Código o número de referencia del pago.
              </FieldDescription>
              <FieldError errors={[errors.reference]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="notes">Notas</FieldLabel>
            <FieldContent>
              <Textarea
                id="notes"
                placeholder="Observaciones adicionales..."
                className="min-h-[80px] resize-y"
                rows={3}
                {...register('notes')}
              />
              <FieldError errors={[errors.notes]} />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

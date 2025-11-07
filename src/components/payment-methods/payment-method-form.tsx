'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import {
  PaymentMethodCreate,
  PaymentMethodUpdate,
} from '@/schemas/payment-methods.schema'

type PaymentMethodFormData = PaymentMethodCreate | PaymentMethodUpdate

export function PaymentMethodForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<PaymentMethodFormData>()

  const paymentType = watch('payment_type')

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel htmlFor="name">Nombre</FieldLabel>
        <FieldContent>
          <Input
            id="name"
            placeholder="Ej: Efectivo, Tarjeta de crédito"
            {...register('name')}
          />
          <FieldError errors={[errors.name]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="payment_type">Tipo de pago</FieldLabel>
        <FieldContent>
          <Select
            value={paymentType}
            onValueChange={(value) => setValue('payment_type', value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="app">Aplicación</SelectItem>
              <SelectItem value="credit">Crédito</SelectItem>
              <SelectItem value="others">Otros</SelectItem>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.payment_type]} />
        </FieldContent>
      </Field>

      <IsActiveFormField name="is_active" />
    </div>
  )
}

'use client'

import { useFormContext } from 'react-hook-form'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IsActiveFormField } from '@/components/ui/is-active-field'
import { Enums } from '@/types/supabase.types'
import { usePaymentType } from '@/hooks/payment-methods/use-payment-type'

export function PaymentMethodForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()

  const paymentType = watch('payment_type')
  const { paymentTypes } = usePaymentType()

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
          <FieldGroup>
            <FieldSet>
              <RadioGroup
                value={(paymentType as string) ?? ''}
                onValueChange={(value) =>
                  setValue('payment_type', value as Enums<'payment_type'>)
                }
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {paymentTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <FieldLabel
                      key={type.value}
                      htmlFor={`payment-type-${type.value}`}
                    >
                      <Field orientation="horizontal" className="items-center">
                        <FieldContent>
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <FieldTitle>{type.label}</FieldTitle>
                              <FieldDescription>
                                {type.description}
                              </FieldDescription>
                            </div>
                          </div>
                        </FieldContent>
                        <RadioGroupItem
                          value={type.value}
                          id={`payment-type-${type.value}`}
                        />
                      </Field>
                    </FieldLabel>
                  )
                })}
              </RadioGroup>
            </FieldSet>
          </FieldGroup>
          <FieldError errors={[errors.payment_type]} />
        </FieldContent>
      </Field>

      <IsActiveFormField name="is_active" />
    </div>
  )
}

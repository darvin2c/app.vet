'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { PaymentMethodForm } from './payment-method-form'
import {
  PaymentMethodUpdateSchema,
  paymentMethodUpdateSchema,
} from '@/schemas/payment-methods.schema'
import { usePaymentMethodUpdate } from '@/hooks/payment-methods/use-payment-method-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface PaymentMethodEditProps {
  paymentMethod: Tables<'payment_methods'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentMethodEdit({
  paymentMethod,
  open,
  onOpenChange,
}: PaymentMethodEditProps) {
  const mutation = usePaymentMethodUpdate()

  const form = useForm<PaymentMethodUpdateSchema>({
    resolver: zodResolver(paymentMethodUpdateSchema),
    defaultValues: {
      name: paymentMethod.name,
      payment_type: paymentMethod.payment_type,
      is_active: paymentMethod.is_active,
      ref_required: paymentMethod.ref_required,
    },
  })

  useEffect(() => {
    if (paymentMethod) {
      form.reset({
        name: paymentMethod.name,
        payment_type: paymentMethod.payment_type,
        is_active: paymentMethod.is_active,
        ref_required: paymentMethod.ref_required,
      })
    }
  }, [paymentMethod, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: paymentMethod.id,
      data,
    })
    onOpenChange(false)
  })

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Método de Pago"
        description="Modifica los datos del método de pago."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Actualizar Método de Pago"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <div className="px-4 overflow-y-auto">
          <PaymentMethodForm />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

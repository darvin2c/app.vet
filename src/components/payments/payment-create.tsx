'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { PaymentForm } from './payment-form'
import {
  CreatePaymentSchema,
  CreatePaymentData,
} from '@/schemas/payments.schema'
import usePaymentCreate from '@/hooks/payments/use-payment-create'
import CanAccess from '@/components/ui/can-access'

interface PaymentCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentCreate({ open, onOpenChange }: PaymentCreateProps) {
  const createPayment = usePaymentCreate()

  const form = useForm({
    resolver: zodResolver(CreatePaymentSchema),
    defaultValues: {
      amount: 0,
      payment_method_id: '',
      payment_date: new Date().toISOString().split('T')[0],
      customer_id: null,
      order_id: null,
      reference: null,
      notes: null,
    },
  })

  const onSubmit = async (data: CreatePaymentData) => {
    await createPayment.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <CanAccess resource="payments" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Pago"
        description="Completa la información para registrar un nuevo pago."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={createPayment.isPending}
        submitLabel="Crear Pago"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <PaymentForm mode="create" />
      </FormSheet>
    </CanAccess>
  )
}

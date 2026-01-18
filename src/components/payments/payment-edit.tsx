'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { PaymentForm } from './payment-form'
import {
  UpdatePaymentSchema,
  UpdatePaymentData,
} from '@/schemas/payments.schema'
import usePaymentUpdate from '@/hooks/payments/use-payment-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface PaymentEditProps {
  payment: Tables<'payments'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentEdit({ payment, open, onOpenChange }: PaymentEditProps) {
  const updatePayment = usePaymentUpdate()

  const form = useForm({
    resolver: zodResolver(UpdatePaymentSchema),
    defaultValues: {
      reference: payment.reference ?? undefined,
      notes: payment.notes ?? undefined,
    },
  })

  const onSubmit = async (data: UpdatePaymentData) => {
    try {
      await updatePayment.mutateAsync({
        id: payment.id,
        data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Pago"
        description="Modifica la información del pago. Solo se pueden editar la referencia y las notas."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updatePayment.isPending}
        submitLabel="Actualizar Pago"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <PaymentForm mode="update" payment={payment} />
      </FormSheet>
    </CanAccess>
  )
}

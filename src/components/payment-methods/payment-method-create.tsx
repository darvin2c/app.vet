'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormSheet } from '@/components/ui/form-sheet'

import { PaymentMethodForm } from './payment-method-form'
import { usePaymentMethodCreate } from '@/hooks/payment-methods/use-payment-method-create'
import { paymentMethodCreateSchema } from '@/schemas/payment-methods.schema'
import CanAccess from '@/components/ui/can-access'

interface PaymentMethodCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PaymentMethodCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PaymentMethodCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = usePaymentMethodCreate()

  const form = useForm({
    resolver: zodResolver(paymentMethodCreateSchema),
    defaultValues: {
      name: '',
      payment_type: 'cash',
      is_active: true,
      ref_required: false,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  })

  return (
    <CanAccess resource="products" action="create">
      <FormSheet
        open={open as boolean}
        onOpenChange={setOpen as any}
        trigger={children as any}
        title="Crear Método de Pago"
        description="Completa los datos para crear un nuevo método de pago."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={mutation.isPending}
        submitLabel="Crear Método de Pago"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-xl"
      >
        <div className="px-4">
          <PaymentMethodForm />
        </div>
      </FormSheet>
    </CanAccess>
  )
}

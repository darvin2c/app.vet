'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { usePaymentMethodDelete } from '@/hooks/payment-methods/use-payment-method-delete'
import { Tables } from '@/types/supabase.types'

type PaymentMethod = Tables<'payment_methods'>

interface PaymentMethodDeleteProps {
  paymentMethod: PaymentMethod
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentMethodDelete({
  paymentMethod,
  open,
  onOpenChange,
}: PaymentMethodDeleteProps) {
  const deletePaymentMethod = usePaymentMethodDelete()

  const handleDelete = async () => {
    await deletePaymentMethod.mutateAsync(paymentMethod.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="¿Estás seguro de eliminar este método de pago?"
      description={`Esta acción eliminará permanentemente el método de pago "${paymentMethod.name}" y no se puede deshacer.`}
      confirmText={paymentMethod.name}
      onConfirm={handleDelete}
      isLoading={deletePaymentMethod.isPending}
    />
  )
}

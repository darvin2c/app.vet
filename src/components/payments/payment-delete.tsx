'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'
import usePaymentDelete from '@/hooks/payments/use-payment-delete'

type Payment = Tables<'payments'>

interface PaymentDeleteProps {
  payment: Payment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentDelete({
  payment,
  open,
  onOpenChange,
}: PaymentDeleteProps) {
  const deletePayment = usePaymentDelete()

  const handleConfirm = async () => {
    await deletePayment.mutateAsync(payment.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Pago"
      description={`¿Estás seguro de que deseas eliminar este pago de $${payment.amount.toFixed(2)}? Esta acción no se puede deshacer.`}
      confirmText="ELIMINAR"
      isLoading={deletePayment.isPending}
    />
  )
}
'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'
import useOrderDelete from '@/hooks/orders/use-order-delete'

interface OrderDeleteProps {
  order: Tables<'orders'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDelete({ order, open, onOpenChange }: OrderDeleteProps) {
  const deleteOrder = useOrderDelete()

  const handleConfirm = async () => {
    await deleteOrder.mutateAsync(order.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Orden"
      description={
        <>
          ¿Estás seguro de que deseas eliminar la orden{' '}
          <strong>{order.order_number}</strong>? Esta acción no se puede
          deshacer y se eliminarán todos los productos asociados a esta orden.
        </>
      }
      confirmText="ELIMINAR"
      isLoading={deleteOrder.isPending}
    />
  )
}

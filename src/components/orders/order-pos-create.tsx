'use client'

import { POSInterface } from './pos/pos-interface'

interface OrderPosCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderPosCreate({ open, onOpenChange }: OrderPosCreateProps) {
  const handleOrderCreated = () => {
    // Cerrar el modal POS cuando se crea la orden
    onOpenChange(false)
  }

  const handleClose = () => {
    // Cerrar el modal POS
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <POSInterface
        onOrderCreated={handleOrderCreated}
        onClose={handleClose}
      />
    </div>
  )
}
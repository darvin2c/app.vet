'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'
import useProductMovementDelete from '@/hooks/product-movements/use-product-movement-delete'

type ProductMovement = Tables<'product_movements'>

interface ProductMovementDeleteProps {
  movement: ProductMovement
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductMovementDelete({
  movement,
  open,
  onOpenChange,
}: ProductMovementDeleteProps) {
  const deleteProductMovement = useProductMovementDelete()

  const handleConfirm = async () => {
    await deleteProductMovement.mutateAsync(movement.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Movimiento"
      description={`¿Estás seguro de que deseas eliminar este movimiento de producto? Esta acción no se puede deshacer y se recalculará automáticamente el stock del producto.`}
      confirmText="ELIMINAR"
      isLoading={deleteProductMovement.isPending}
    />
  )
}

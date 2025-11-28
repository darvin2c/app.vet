'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useDeleteProductUnit from '@/hooks/product-units/use-product-unit-delete'
import { Tables } from '@/types/supabase.types'

interface ProductUnitDeleteProps {
  unit: Tables<'product_units'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductUnitDelete({
  unit,
  open,
  onOpenChange,
}: ProductUnitDeleteProps) {
  const deleteProductUnit = useDeleteProductUnit()

  const handleDelete = async () => {
    await deleteProductUnit.mutateAsync(unit.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="¿Estás seguro de eliminar esta unidad?"
      description={`Esta acción eliminará permanentemente la unidad "${unit.name || unit.abbreviation}" y no se puede deshacer.`}
      confirmText={unit.name || unit.abbreviation || ''}
      onConfirm={handleDelete}
      isLoading={deleteProductUnit.isPending}
    />
  )
}

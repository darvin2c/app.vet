'use client'

import { useState } from 'react'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useDeleteProductUnit from '@/hooks/product-units/use-delete-product-unit'
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
      description={`Esta acción eliminará permanentemente la unidad "${unit.name || unit.code}" y no se puede deshacer.`}
      confirmText={unit.name || unit.code}
      onConfirm={handleDelete}
      isLoading={deleteProductUnit.isPending}
    />
  )
}

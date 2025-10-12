'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useSupplierDelete from '@/hooks/suppliers/use-supplier-delete'
import { Tables } from '@/types/supabase.types'

interface SupplierDeleteProps {
  supplier: Tables<'suppliers'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierDelete({
  supplier,
  open,
  onOpenChange,
}: SupplierDeleteProps) {
  const { mutate: deleteSupplier, isPending } = useSupplierDelete()

  const handleDelete = () => {
    deleteSupplier(supplier.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Proveedor"
      description={`¿Estás seguro de que deseas eliminar el proveedor "${supplier.name}"? Esta acción no se puede deshacer.`}
      confirmText={supplier.name}
      onConfirm={handleDelete}
      isLoading={isPending}
    />
  )
}

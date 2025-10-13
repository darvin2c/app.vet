'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Database } from '@/types/supabase.types'
import useSupplierDelete from '@/hooks/suppliers/use-supplier-delete'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface SupplierDeleteProps {
  supplier: Supplier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierDelete({
  supplier,
  open,
  onOpenChange,
}: SupplierDeleteProps) {
  const deleteSupplier = useSupplierDelete()

  const handleConfirm = async () => {
    await deleteSupplier.mutateAsync(supplier.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Proveedor"
      description={
        <>
          ¿Estás seguro de que deseas eliminar el proveedor{' '}
          <strong>{supplier.name}</strong>? Esta acción no se puede deshacer y
          se perderán todos los datos asociados.
        </>
      }
      confirmText="ELIMINAR"
      isLoading={deleteSupplier.isPending}
    />
  )
}

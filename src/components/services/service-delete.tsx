'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useProductDelete from '@/hooks/products/use-product-delete'
import { Tables } from '@/types/supabase.types'

interface ServiceDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Tables<'products'>
}

export function ServiceDelete({
  open,
  onOpenChange,
  service,
}: ServiceDeleteProps) {
  const deleteProduct = useProductDelete()

  const handleDelete = async () => {
    await deleteProduct.mutateAsync(service.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleDelete}
      title="Eliminar Servicio"
      description={`¿Estás seguro de que deseas eliminar el servicio "${service.name}"? Esta acción no se puede deshacer.`}
      confirmText="ELIMINAR"
      isLoading={deleteProduct.isPending}
    />
  )
}

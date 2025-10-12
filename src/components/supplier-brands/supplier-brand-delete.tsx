'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useSupplierBrandDelete from '@/hooks/supplier-brands/use-supplier-brand-delete'

interface SupplierBrandDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplierId: string
  brandId: string
  supplierName?: string
  brandName?: string
}

export function SupplierBrandDelete({
  open,
  onOpenChange,
  supplierId,
  brandId,
  supplierName,
  brandName,
}: SupplierBrandDeleteProps) {
  const { mutate: deleteSupplierBrand, isPending } = useSupplierBrandDelete()

  const handleDelete = () => {
    deleteSupplierBrand(
      { supplierId, brandId },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Desasignar marca del proveedor"
      description={`¿Estás seguro de que deseas desasignar la marca "${brandName}" del proveedor "${supplierName}"? Esta acción no se puede deshacer.`}
      confirmText="desasignar"
      onConfirm={handleDelete}
      loading={isPending}
    />
  )
}
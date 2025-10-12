'use client'

import { useState } from 'react'
import { useProductBrandDelete } from '@/hooks/product-brands/use-product-brand-delete'
import { Tables } from '@/types/supabase.types'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'

interface ProductBrandDeleteProps {
  brand: Tables<'product_brands'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandDelete({ brand, open, onOpenChange }: ProductBrandDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutateAsync: deleteProductBrand } = useProductBrandDelete()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteProductBrand(brand.id)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar marca de producto:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar Marca de Producto"
      description={`¿Estás seguro de que deseas eliminar la marca ${brand.name}? Esta acción no se puede deshacer.`}
      confirmText={brand.name}
      onConfirm={handleDelete}
      loading={isDeleting}
      variant="destructive"
    />
  )
}
'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Database } from '@/types/supabase.types'
import useDeleteProduct from '@/hooks/products/use-product-delete'

type Product = Database['public']['Tables']['products']['Row']

interface ProductDeleteProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDelete({
  product,
  open,
  onOpenChange,
}: ProductDeleteProps) {
  const deleteProduct = useDeleteProduct()

  const handleConfirm = async () => {
    await deleteProduct.mutateAsync(product.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onConfirm={handleConfirm}
      title="Eliminar Producto"
      description={
        <>
          ¿Estás seguro de que deseas eliminar el producto{' '}
          <strong>{product.name}</strong>? Esta acción no se puede deshacer y se
          perderán todos los datos asociados.
        </>
      }
      confirmText="ELIMINAR"
      isLoading={deleteProduct.isPending}
    />
  )
}

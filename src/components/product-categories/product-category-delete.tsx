'use client'

import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import useDeleteProductCategory from '@/hooks/product-categories/use-product-category-delete'
import { Tables } from '@/types/supabase.types'

type ProductCategory = Tables<'product_categories'>

interface ProductCategoryDeleteProps {
  category: ProductCategory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryDelete({
  category,
  open,
  onOpenChange,
}: ProductCategoryDeleteProps) {
  const deleteProductCategory = useDeleteProductCategory()

  const handleDelete = async () => {
    await deleteProductCategory.mutateAsync(category.id)
    onOpenChange(false)
  }

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="¿Estás seguro de eliminar esta categoría?"
      description={`Esta acción eliminará permanentemente la categoría "${category.name}" y no se puede deshacer.`}
      confirmText={category.name}
      onConfirm={handleDelete}
      isLoading={deleteProductCategory.isPending}
    />
  )
}

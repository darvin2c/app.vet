import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useProductCategoryCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'product_categories'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const productCategoryData: TablesInsert<'product_categories'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: productCategories, error } = await supabase
        .from('product_categories')
        .insert(productCategoryData)
        .select()

      if (error) {
        throw new Error(`Error al crear categorías de productos: ${error.message}`)
      }

      return productCategories
    },
    onSuccess: (productCategories) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'product_categories'],
      })
      toast.success(`Se crearon ${productCategories.length} categorías de productos exitosamente`)
    },
    onError: (error) => {
      console.error('Error al crear categorías de productos:', error)
      toast.error(error.message || 'Error al crear categorías de productos')
    },
  })
}
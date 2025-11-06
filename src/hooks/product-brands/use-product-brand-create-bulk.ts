import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useProductBrandCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'product_brands'>, 'tenant_id'>[]
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const productBrandData: TablesInsert<'product_brands'>[] = data.map(
        (item) => ({
          ...item,
          tenant_id: currentTenant.id,
        })
      )

      const { data: productBrands, error } = await supabase
        .from('product_brands')
        .insert(productBrandData)
        .select()

      if (error) {
        throw new Error(`Error al crear marcas de productos: ${error.message}`)
      }

      return productBrands
    },
    onSuccess: (productBrands) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'product_brands'],
      })
      toast.success(
        `Se crearon ${productBrands.length} marcas de productos exitosamente`
      )
    },
    onError: (error) => {
      console.error('Error al crear marcas de productos:', error)
      toast.error('Error al crear marcas de productos', {
        description: error.message,
      })
    },
  })
}

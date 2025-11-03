import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useProductUnitCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'product_units'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const productUnitData: TablesInsert<'product_units'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: productUnits, error } = await supabase
        .from('product_units')
        .insert(productUnitData)
        .select()

      if (error) {
        throw new Error(`Error al crear unidades de productos: ${error.message}`)
      }

      return productUnits
    },
    onSuccess: (productUnits) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'product_units'],
      })
      toast.success(`Se crearon ${productUnits.length} unidades de productos exitosamente`)
    },
    onError: (error) => {
      console.error('Error al crear unidades de productos:', error)
      toast.error(error.message || 'Error al crear unidades de productos')
    },
  })
}
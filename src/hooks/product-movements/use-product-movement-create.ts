import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { TablesInsert } from '@/types/supabase.types'

export default function useProductMovementCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'product_movements'>, 'tenant_id'>
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      const { data: movement, error } = await supabase
        .from('product_movements')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear movimiento: ${error.message}`)
      }

      return movement
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'product-movements'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'products'],
      })
      toast.success('Movimiento de producto creado exitosamente')
    },
    onError: (error) => {
      console.error('Error al crear movimiento de producto:', error)
      toast.error(error.message || 'Error al crear movimiento de producto')
    },
  })
}

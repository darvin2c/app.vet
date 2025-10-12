import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useUpdateProductCategory() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: TablesUpdate<'product_categories'> & { id: string }
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, ...updateFields } = data
      const updateData: TablesUpdate<'product_categories'> =
        removeUndefined(updateFields)

      // Convertir fechas a UTC si existen
      if (updateData.created_at) {
        updateData.created_at = new Date(updateData.created_at).toISOString()
      }
      if (updateData.updated_at) {
        updateData.updated_at = new Date(updateData.updated_at).toISOString()
      }

      const { error } = await supabase
        .from('product_categories')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al actualizar categoría: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] })
      toast.success('Categoría actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

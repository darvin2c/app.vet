import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useUpdateProductUnit() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: TablesUpdate<'product_units'> & { id: string }
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, ...updateFields } = data
      const updateData: TablesUpdate<'product_units'> =
        removeUndefined(updateFields)

      const { error } = await supabase
        .from('product_units')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al actualizar unidad: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-units'] })
      toast.success('Unidad actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

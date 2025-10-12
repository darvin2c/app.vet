import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useUpdateProcedure() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: TablesUpdate<'procedures'> & { id: string }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, ...updateFields } = data
      const updateData: TablesUpdate<'procedures'> =
        removeUndefined(updateFields)

      const { data: procedure, error } = await supabase
        .from('procedures')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar procedimiento: ${error.message}`)
      }

      return procedure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] })
      toast.success('Procedimiento actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

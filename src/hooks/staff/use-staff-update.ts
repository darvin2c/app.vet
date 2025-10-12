import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useStaffUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: TablesUpdate<'staff'> & { id: string }
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, ...updateFields } = data
      const updateData: TablesUpdate<'staff'> = removeUndefined(updateFields)

      // Actualizar datos del staff
      const { data: staff, error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar staff: ${error.message}`)
      }

      return staff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Miembro del staff actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useUpdateAppointmentType() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: TablesUpdate<'appointment_types'> & { id: string }
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, ...updateFields } = data
      const updateData: TablesUpdate<'appointment_types'> =
        removeUndefined(updateFields)

      const { data: appointmentType, error } = await supabase
        .from('appointment_types')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar tipo de cita: ${error.message}`)
      }

      return appointmentType
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment-types'] })
      toast.success('Tipo de cita actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

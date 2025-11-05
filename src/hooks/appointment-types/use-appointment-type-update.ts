import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { TablesUpdate } from '@/types/supabase.types'

export function useAppointmentTypeUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: {
      id: string
      data: Omit<TablesUpdate<'appointment_types'>, 'tenant_id'>
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, data: updateData } = data

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
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'appointment-types'],
      })
      toast.success('Tipo de cita actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

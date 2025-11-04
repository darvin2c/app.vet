import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { AppointmentTypeUpdate } from '@/schemas/appointment-types.schema'

export function useAppointmentTypeDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (appointmentTypeId: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Verificar si hay citas asociadas activas
      const { data: appointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_type_id', appointmentTypeId)
        .eq('tenant_id', currentTenant.id)
        .neq('status', 'cancelled')
        .neq('status', 'completed')

      if (appointments && appointments.length > 0) {
        throw new Error(
          'No se puede eliminar el tipo de cita porque tiene citas activas asociadas'
        )
      }

      const { error } = await supabase
        .from('appointment_types')
        .delete()
        .eq('id', appointmentTypeId)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar tipo de cita: ${error.message}`)
      }

      return appointmentTypeId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'appointment-types'],
      })
      toast.success('Tipo de cita eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

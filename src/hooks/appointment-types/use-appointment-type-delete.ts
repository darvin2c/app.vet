import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useAppointmentTypeDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      const { error } = await supabase
        .from('appointment_types')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar tipo de cita: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'appointment-types'],
      })
      toast.success('Tipo de cita eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar tipo de cita', {
        description: error.message,
      })
    },
  })
}

import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function useAppointmentTypeCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'appointment_types'>, 'tenant_id'>[]
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const appointmentTypeData = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: appointmentTypes, error } = await supabase
        .from('appointment_types')
        .insert(appointmentTypeData)
        .select()

      if (error) {
        throw new Error(`Error al crear tipos de cita: ${error.message}`)
      }

      return appointmentTypes
    },
    onSuccess: (appointmentTypes) => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'appointment-types'],
      })
      toast.success(
        `Se crearon ${appointmentTypes?.length || 0} tipos de cita exitosamente`
      )
    },
    onError: (error) => {
      console.error('Error al crear tipos de cita:', error)
      toast.error(error.message || 'Error al crear tipos de cita')
    },
  })
}

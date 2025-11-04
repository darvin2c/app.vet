import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { AppointmentTypeCreate } from '@/schemas/appointment-types.schema'

export function useAppointmentTypeCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: AppointmentTypeCreate) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: appointmentType, error } = await supabase
        .from('appointment_types')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear tipo de cita: ${error.message}`)
      }

      return appointmentType
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'appointment-types'],
      })
      toast.success('Tipo de cita creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

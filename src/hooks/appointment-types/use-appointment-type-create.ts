import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function useAppointmentTypeCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'appointment_types'>, 'tenant_id'>
    ) => {
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

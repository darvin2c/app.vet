import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Database } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type Patient = Database['public']['Tables']['patients']['Row']

export function usePatientDetail(patientId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patient-detail', currentTenant?.id, patientId],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      if (!patientId) {
        throw new Error('ID de paciente requerido')
      }

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('id', patientId)
        .single()

      if (error) {
        throw new Error(`Error al obtener paciente: ${error.message}`)
      }

      return data as Patient
    },
    enabled: !!currentTenant?.id && !!patientId,
  })
}

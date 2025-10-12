import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Treatment, TreatmentFilters } from '@/schemas/treatments.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function usePatientTreatments(
  patientId: string,
  filters?: TreatmentFilters
) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patient-treatments', currentTenant?.id, patientId, filters],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      if (!patientId) {
        throw new Error('ID de paciente requerido')
      }

      // Por ahora retornamos un array vacío ya que la tabla treatments no existe
      // TODO: Implementar cuando se cree la tabla treatments en la base de datos
      return [] as Treatment[]
    },
    enabled: !!currentTenant?.id && !!patientId,
  })
}

// Hook para obtener tratamientos activos del paciente
export function usePatientActiveTreatments(patientId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: ['patient-active-treatments', currentTenant?.id, patientId],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      if (!patientId) {
        throw new Error('ID de paciente requerido')
      }

      // Por ahora retornamos un array vacío ya que la tabla treatments no existe
      // TODO: Implementar cuando se cree la tabla treatments en la base de datos
      return [] as Treatment[]
    },
    enabled: !!currentTenant?.id && !!patientId,
  })
}

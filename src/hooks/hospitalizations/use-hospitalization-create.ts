import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

// Tipo extendido para crear hospitalization con pet_id
type HospitalizationInsert = Omit<TablesInsert<'hospitalizations'>, 'tenant_id'> & {
  pet_id: string
}

export function useCreateHospitalization() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: HospitalizationInsert) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Convertir fechas a UTC antes de guardar
      const hospitalizationData = {
        ...data,
        tenant_id: currentTenant.id,
        admission_at: new Date(data.admission_at).toISOString(),
        discharge_at: data.discharge_at ? new Date(data.discharge_at).toISOString() : null,
      }

      const { data: hospitalization, error } = await supabase
        .from('hospitalizations')
        .insert(hospitalizationData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear hospitalización: ${error.message}`)
      }

      return hospitalization
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [currentTenant?.id, 'hospitalizations'] })
      queryClient.invalidateQueries({ queryKey: [currentTenant?.id, 'hospitalizations', undefined, undefined, undefined, variables.pet_id] })
      toast.success('Hospitalización creada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
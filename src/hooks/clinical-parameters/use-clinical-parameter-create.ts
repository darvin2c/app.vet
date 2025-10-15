import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useClinicalParameterCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'clinical_parameters'>, 'tenant_id'>
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: clinicalParameter, error } = await supabase
        .from('clinical_parameters')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return clinicalParameter as Tables<'clinical_parameters'>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical-parameters'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-clinical-parameters'],
      })
    },
  })
}

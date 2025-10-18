import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useClinicalParameterCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
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
      toast.success('Parámetros clínicos creados exitosamente')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical-parameters'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-clinical-parameters'],
      })
    },
    onError: (error) => {
      console.error(error)
      toast.error('Error al crear parámetros clínicos', {
        description: error.message,
      })
    },
  })
}

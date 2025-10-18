import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useClinicalParameterUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'clinical_parameters'>, 'tenant_id'>
    }) => {
      const { data: clinicalParameter, error } = await supabase
        .from('clinical_parameters')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return clinicalParameter
    },
    onSuccess: () => {
      toast.success('Parámetros clínicos actualizados exitosamente')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical-parameters'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-clinical-parameters'],
      })
    },
    onError: (error) => {
      console.error(error)
      toast.error('Error al actualizar parámetros clínicos', {
        description: error.message,
      })
    },
  })
}

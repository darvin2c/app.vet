import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useTreatmentCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'treatments'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: treatment, error } = await supabase
        .from('treatments')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return treatment as Tables<'treatments'>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'treatments'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-treatments'],
      })
    },
  })
}

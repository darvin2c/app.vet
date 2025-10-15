import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useVaccinationCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'vaccinations'>, 'tenant_id'>
    ) => {
      const supabase = createClient()

      const { data: vaccination, error } = await supabase
        .from('vaccinations')
        .insert({
          ...data,
          tenant_id: currentTenant?.id!,
        })
        .select()
        .single()

      if (error) throw error
      return vaccination
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'vaccinations'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-vaccinations'],
      })
    },
  })
}

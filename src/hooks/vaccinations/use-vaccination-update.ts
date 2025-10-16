import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useVaccinationUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'vaccinations'>, 'tenant_id'>
    }) => {
      const supabase = createClient()

      const { data: vaccination, error } = await supabase
        .from('vaccinations')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)
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

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useDewormingCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'pet_dewormings'>, 'tenant_id'>
    ) => {
      if (!currentTenant?.id) throw new Error('No tenant selected')

      const { data: deworming, error } = await supabase
        .from('pet_dewormings')
        .insert({ ...data, tenant_id: currentTenant.id })
        .select()
        .single()

      if (error) throw error
      return deworming
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-records'],
      })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useSurgeryCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'surgeries'>, 'tenant_id'>) => {
      const supabase = createClient()

      const { data: surgery, error } = await supabase
        .from('surgeries')
        .insert({
          ...data,
          tenant_id: currentTenant?.id!,
        })
        .select()
        .single()

      if (error) throw error
      return surgery
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'surgeries'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-surgeries'],
      })
    },
  })
}

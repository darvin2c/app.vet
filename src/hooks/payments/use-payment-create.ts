import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { TablesInsert } from '@/types/supabase.types'

export function usePaymentCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'payments'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return payment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'payments'],
      })
    },
  })
}

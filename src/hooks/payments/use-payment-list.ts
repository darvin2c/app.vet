import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'

type Payment = Tables<'payments'> & {
  payment_methods: Tables<'payment_methods'>
}

export function usePaymentList({
  orderId,
}: {
  orderId?: string
} = {}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'payments', orderId],
    queryFn: async (): Promise<Payment[]> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      let query = supabase
        .from('payments')
        .select(
          `
          *,
          payment_methods (*)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      if (orderId) {
        query = query.eq('order_id', orderId)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}

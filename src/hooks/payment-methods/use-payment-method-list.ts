import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'

type PaymentMethod = Tables<'payment_methods'>

export function usePaymentMethodList() {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'payment_methods'],
    queryFn: async (): Promise<PaymentMethod[]> => {
      if (!currentTenant?.id) {
        throw new Error('No tenant selected')
      }

      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}

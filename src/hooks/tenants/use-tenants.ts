import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useUser from '../auth/use-user'

export default function useTenants() {
  const { data: user } = useUser()
  const tenantQuery = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('*, tenant:tenant_id(*)')
        .eq('user_id', user!.id)
      if (error) {
        throw error
      }
      const tenants = data?.map((item) => item.tenant)
      return tenants
    },
    enabled: !!user?.id,
  })

  return tenantQuery
}

import { useQuery } from '@tanstack/react-query'
import useUser from '../auth/use-user'
import { supabase } from '@/lib/supabase/client'

export default function useGetTenant(idOrSubdomain?: string) {
  const { data: user } = useUser()
  const tenantQuery = useQuery({
    queryKey: ['tenant', idOrSubdomain],
    queryFn: async () => {
      if (!idOrSubdomain) {
        return null
      }
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('subdomain', idOrSubdomain)

      if (error) {
        throw error
      }
      const tenant = data?.[0]
      return tenant
    },
    enabled: !!user?.id,
  })
  return tenantQuery
}

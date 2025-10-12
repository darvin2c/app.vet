import { useQuery } from '@tanstack/react-query'
import useUser from '../auth/use-user'
import { supabase } from '@/lib/supabase/client'

export default function useGetTenant(idOrSlug: string) {
  const { data: user } = useUser()
  const tenantQuery = useQuery({
    queryKey: ['tenant'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)

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

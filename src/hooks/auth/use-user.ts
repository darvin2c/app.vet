'use client'

import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function useUser() {
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session?.user
    },
  })

  return userQuery
}

export function useProfile() {
  const { data: user } = useUser()
  const { currentTenant } = useCurrentTenantStore()
  const profileQuery = useQuery({
    queryKey: [currentTenant?.id, 'profile'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()

      const { data: tenantUser } = await supabase
        .from('tenant_users')
        .select('*, role:role_id(*)')
        .eq('user_id', user!.id)
        .eq('tenant_id', currentTenant!.id)
        .single()

      return {
        ...data,
        role: tenantUser?.role,
        isSuperuser: tenantUser?.is_superuser || false,
      }
    },
    enabled: !!user?.id,
  })

  return profileQuery
}

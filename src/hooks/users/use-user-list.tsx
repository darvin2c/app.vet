import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function useUserList() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { currentTenant } = useCurrentTenantStore()
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data, error } = await supabase
        .from('tenant_users')
        .select('*, profiles:user_id(*)')
        .eq('tenant_id', currentTenant?.id)
        .order('created_at', { ascending: false })

      console.log('error', error)
      if (error) throw error

      console.log('data', data)
      return data.map((item) => ({
        ...item.profiles,
      }))
    },
  })
}

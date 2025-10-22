import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type PetSurgery = Tables<'surgeries'>

export function useSurgeryList(petId?: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'surgeries', ...(petId ? [petId] : [])],
    queryFn: async () => {
      if (!currentTenant) return []

      let query = supabase
        .from('surgeries')
        .select('*')
        .eq('tenant_id', currentTenant.id)

      if (petId) {
        query = query.eq('pet_id', petId)
      }

      const { data, error } = await query.order('created_at', {
        ascending: false,
      })

      if (error) throw error
      return data || []
    },
    enabled: !!currentTenant,
  })
}

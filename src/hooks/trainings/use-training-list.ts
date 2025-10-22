import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type Training = Tables<'trainings'> & {
  trainer: Tables<'staff'> | null
}

export function useTrainingList(petId?: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'trainings', petId],
    queryFn: async (): Promise<Training[]> => {
      if (!currentTenant) return []

      let query = supabase
        .from('trainings')
        .select(`
          *,
          trainer:staff(*)
        `)
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      if (petId) {
        query = query.eq('treatment_id', petId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
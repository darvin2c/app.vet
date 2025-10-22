import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type Vaccination = Tables<'vaccinations'> & {
  clinical_record: Tables<'clinical_records'> | null
}

export function useVaccinationList(petId?: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'vaccinations', petId],
    queryFn: async (): Promise<Vaccination[]> => {
      if (!currentTenant) return []

      let query = supabase
        .from('vaccinations')
        .select(`
          *,
          clinical_record:clinical_records(*)
        `)
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      if (petId) {
        query = query.eq('clinical_record.pet_id', petId)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    },
    enabled: !!currentTenant?.id,
  })
}
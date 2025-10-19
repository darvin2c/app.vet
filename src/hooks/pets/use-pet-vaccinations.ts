import { useQuery } from '@tanstack/react-query'
import { Tables } from '@/types/supabase.types'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

type Vaccination = Tables<'vaccinations'> & {
  clinical_records: Tables<'clinical_records'> | null
  staff: Tables<'staff'> | null
}

export function usePetVaccinations(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'vaccinations', 'pet', petId],
    queryFn: async (): Promise<Vaccination[]> => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('vaccinations')
        .select(
          `
          *,
          clinical_records!inner (
            *,
            staff (*)
          )
        `
        )
        .eq('tenant_id', currentTenant?.id!)
        .eq('clinical_records.pet_id', petId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((vaccination) => ({
        ...vaccination,
        staff: vaccination.clinical_records?.staff || null,
      }))
    },
    enabled: !!petId && !!currentTenant?.id,
  })
}

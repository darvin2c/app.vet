import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { Tables } from '@/types/supabase.types'

export type PendingBillingItem = Tables<'record_items'> & {
  products: Tables<'products'> | null
  clinical_records: {
    pet_id: string
    record_type: string
  } | null
}

export function usePendingBillingItems(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'pending-billing-items', petId],
    queryFn: async () => {
      if (!currentTenant) {
        return []
      }

      const supabase = createClient()

      // Consultamos directamente record_items filtrando por pet_id a través de la relación con clinical_records
      const { data, error } = await supabase
        .from('record_items')
        .select(
          `
          *,
          products(*),
          clinical_records!inner(
            pet_id,
            record_type
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
      console.log('data', data, petId)
      if (error) {
        console.error('Error fetching pending billing items:', error)
        throw error
      }

      return (data as unknown as PendingBillingItem[]) || []
    },
    enabled: !!currentTenant && !!petId,
  })
}

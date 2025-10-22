import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useMedicalRecordItemListByPet(petId: string) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'record_items', 'by-pet', petId],
    queryFn: async () => {
      if (!currentTenant) return []

      const { data, error } = await supabase
        .from('record_items')
        .select(
          `
          *,
          products(*)
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!currentTenant && !!petId,
  })
}

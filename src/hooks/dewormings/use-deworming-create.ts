import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useDewormingCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'pet_dewormings'>, 'tenant_id'> & {
        items?: {
          product_id: string
          qty: number
          unit_price?: number
          discount?: number
          notes?: string
        }[]
      }
    ) => {
      if (!currentTenant?.id) throw new Error('No tenant selected')

      const { items, ...dewormingData } = data

      const { data: deworming, error } = await supabase
        .from('pet_dewormings')
        .insert({ ...dewormingData, tenant_id: currentTenant.id })
        .select()
        .single()

      if (error) throw error

      if (items && items.length > 0) {
        const itemsToInsert = items.map((item) => ({
          record_id: dewormingData.clinical_record_id,
          product_id: item.product_id,
          qty: item.qty,
          unit_price: item.unit_price || 0,
          discount: item.discount || 0,
          notes: item.notes,
          tenant_id: currentTenant.id!,
        }))

        const { error: itemsError } = await supabase
          .from('record_items')
          .insert(itemsToInsert)

        if (itemsError) throw itemsError
      }

      return deworming
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id!, 'pet_dewormings'],
      })
    },
  })
}

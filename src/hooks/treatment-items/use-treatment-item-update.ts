import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useTreatmentItemUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'treatment_items'>, 'tenant_id'>
    }) => {
      const supabase = createClient()

      const { data: treatmentItem, error } = await supabase
        .from('treatment_items')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)
        .select()
        .single()

      if (error) throw error
      return treatmentItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'treatment_items'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-treatment-items'],
      })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useTreatmentUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'treatments'>, 'tenant_id'>
    }) => {
      const { data: treatment, error } = await supabase
        .from('treatments')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return treatment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'treatments'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-treatments'],
      })
    },
  })
}

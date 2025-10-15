import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useTrainingUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'trainings'>, 'tenant_id'>
    }) => {
      const supabase = createClient()

      const { data: training, error } = await supabase
        .from('trainings')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)
        .select()
        .single()

      if (error) throw error
      return training
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'trainings'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-trainings'],
      })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useTrainingDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()

      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)

      if (error) throw error
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

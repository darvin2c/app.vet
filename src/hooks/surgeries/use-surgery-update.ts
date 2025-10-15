import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenant from '@/hooks/tenants/use-current-tenant-store'

export function useSurgeryUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenant()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'surgeries'>, 'tenant_id'>
    }) => {
      const supabase = createClient()

      const { data: surgery, error } = await supabase
        .from('surgeries')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)
        .select()
        .single()

      if (error) throw error
      return surgery
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'surgeries'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-surgeries'],
      })
    },
  })
}

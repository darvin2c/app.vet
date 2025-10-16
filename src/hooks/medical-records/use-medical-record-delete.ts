import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useMedicalRecordDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clinical_records')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical_records'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-medical-records'],
      })
    },
  })
}

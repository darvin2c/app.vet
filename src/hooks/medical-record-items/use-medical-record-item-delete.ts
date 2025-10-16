import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useMedicalRecordItemDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()

      const { error } = await supabase
        .from('record_items')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant?.id!)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'medical_record_items'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-medical-record-items'],
      })
    },
  })
}

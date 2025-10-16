import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useMedicalRecordItemCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'record_items'>, 'tenant_id'>
    ) => {
      const supabase = createClient()

      const { data: medicalRecordItem, error } = await supabase
        .from('record_items')
        .insert({
          ...data,
          tenant_id: currentTenant?.id!,
        })
        .select()
        .single()

      if (error) throw error
      return medicalRecordItem
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

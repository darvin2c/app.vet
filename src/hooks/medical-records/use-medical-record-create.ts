import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Tables, TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useMedicalRecordCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'clinical_records'>, 'tenant_id'>
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: medicalRecord, error } = await supabase
        .from('clinical_records')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      return medicalRecord as Tables<'clinical_records'>
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

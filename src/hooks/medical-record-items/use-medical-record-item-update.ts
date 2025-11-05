import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function useMedicalRecordItemUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'record_items'>, 'tenant_id'>
    }) => {
      const supabase = createClient()

      // Validar tenant seleccionado para evitar non-null assertion
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: medicalRecordItem, error } = await supabase
        .from('record_items')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
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

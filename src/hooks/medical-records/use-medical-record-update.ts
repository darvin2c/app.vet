import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useMedicalRecordUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'clinical_records'>, 'tenant_id'>
    }) => {
      const { data: medicalRecord, error } = await supabase
        .from('clinical_records')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return medicalRecord
    },
    onSuccess: () => {
      toast.success('Registro médico actualizado exitosamente')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical_records'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-medical-records'],
      })
    },
    onError: (error) => {
      console.error('Error al actualizar el registro médico', error)
      toast.error('Error al actualizar el registro médico', {
        description: error.message,
      })
    },
  })
}

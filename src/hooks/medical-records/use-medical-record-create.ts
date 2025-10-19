import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { toast } from 'sonner'

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

      return medicalRecord
    },
    onSuccess: () => {
      toast.success('Registro médico creado exitosamente')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical_records'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pet-medical-records'],
      })
    },
    onError: (error) => {
      console.error('Error al crear el registro médico', error)
      toast.error('Error al crear el registro médico', {
        description: error.message,
      })
    },
  })
}

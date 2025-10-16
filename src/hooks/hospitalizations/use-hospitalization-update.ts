import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

// Tipo extendido para actualizar hospitalization con pet_id
type HospitalizationUpdate = Omit<
  TablesUpdate<'hospitalizations'>,
  'tenant_id'
> & {
  pet_id?: string
}

export function useUpdateHospitalization() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: HospitalizationUpdate
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Convertir fechas a UTC antes de guardar
      const hospitalizationData = {
        ...data,
        admission_at: data.admission_at
          ? new Date(data.admission_at).toISOString()
          : undefined,
        discharge_at: data.discharge_at
          ? new Date(data.discharge_at).toISOString()
          : undefined,
      }

      const { data: hospitalization, error } = await supabase
        .from('hospitalizations')
        .update(hospitalizationData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar hospitalización: ${error.message}`)
      }

      return hospitalization
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'hospitalizations'],
      })
      if (variables.data.pet_id) {
        queryClient.invalidateQueries({
          queryKey: [
            currentTenant?.id,
            'hospitalizations',
            undefined,
            undefined,
            undefined,
            variables.data.pet_id,
          ],
        })
      }
      toast.success('Hospitalización actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

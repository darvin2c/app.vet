import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useSpecialtyUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'specialties'>, 'tenant_id'>
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const updateData: TablesUpdate<'specialties'> = removeUndefined(data)

      const { data: specialty, error } = await supabase
        .from('specialties')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar especialidad: ${error.message}`)
      }

      return specialty
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'specialties'],
      })
      toast.success('Especialidad actualizada exitosamente')
    },
    onError: (error: any) => {
      console.error('Error al actualizar especialidad:', error)
      toast.error(error?.message || 'Error al actualizar especialidad')
    },
  })
}

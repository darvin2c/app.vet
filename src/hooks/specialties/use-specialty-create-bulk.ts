import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useSpecialtyCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'specialties'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const specialtyData: TablesInsert<'specialties'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: specialties, error } = await supabase
        .from('specialties')
        .insert(specialtyData)
        .select()

      if (error) {
        throw new Error(`Error al crear especialidades: ${error.message}`)
      }

      return specialties
    },
    onSuccess: (specialties) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'specialties'],
      })
      toast.success(`Se crearon ${specialties.length} especialidades exitosamente`)
    },
    onError: (error) => {
      console.error('Error al crear especialidades:', error)
      toast.error(error.message || 'Error al crear especialidades')
    },
  })
}
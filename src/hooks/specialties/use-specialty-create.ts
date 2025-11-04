import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useSpecialtyCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'specialties'>, 'tenant_id'>
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const specialtyData: TablesInsert<'specialties'> = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: specialty, error } = await supabase
        .from('specialties')
        .insert(specialtyData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear especialidad: ${error.message}`)
      }

      return specialty
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'specialties'],
      })
      toast.success('Especialidad creada exitosamente')
    },
    onError: (error) => {
      console.error('Error al crear especialidad:', error)
      toast.error(error.message || 'Error al crear especialidad')
    },
  })
}

import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { CreateStaffSpecialtySchema } from '@/schemas/staff-specialties.schema'
import { TablesInsert } from '@/types/supabase.types'

export default function useStaffSpecialtyCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateStaffSpecialtySchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const staffSpecialtyData: TablesInsert<'staff_specialties'> = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: result, error } = await supabase
        .from('staff_specialties')
        .insert(staffSpecialtyData)
        .select(
          `
          *,
          staff (
            id,
            first_name,
            last_name,
            email,
            is_active
          ),
          specialties (
            id,
            name,
            is_active
          )
        `
        )
        .single()

      if (error) {
        throw new Error(
          `Error al crear relación staff-especialidad: ${error.message}`
        )
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-specialties'] })
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['specialties'] })
      toast.success('Especialidad asignada correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al asignar especialidad')
    },
  })
}

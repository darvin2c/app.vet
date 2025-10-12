import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AssignSpecialtiesToStaffSchema } from '@/schemas/staff-specialties.schema'
import { TablesInsert } from '@/types/supabase.types'

export default function useAssignSpecialtiesToStaff() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: AssignSpecialtiesToStaffSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Primero eliminar todas las especialidades existentes del staff
      const { error: deleteError } = await supabase
        .from('staff_specialties')
        .delete()
        .eq('staff_id', data.staff_id)

      if (deleteError) {
        throw new Error(`Error al eliminar especialidades existentes: ${deleteError.message}`)
      }

      // Luego insertar las nuevas especialidades
      const staffSpecialties: TablesInsert<'staff_specialties'>[] = data.specialty_ids.map(
        (specialtyId) => ({
          staff_id: data.staff_id,
          specialty_id: specialtyId,
          tenant_id: currentTenant.id,
        })
      )

      const { error: insertError } = await supabase
        .from('staff_specialties')
        .insert(staffSpecialties)

      if (insertError) {
        throw new Error(`Error al asignar especialidades: ${insertError.message}`)
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-specialties'] })
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      toast.success('Especialidades asignadas correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al asignar especialidades')
    },
  })
}
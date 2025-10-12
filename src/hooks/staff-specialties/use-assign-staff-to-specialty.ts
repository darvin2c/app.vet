import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AssignStaffToSpecialtySchema } from '@/schemas/staff-specialties.schema'
import { TablesInsert } from '@/types/supabase.types'

export default function useAssignStaffToSpecialty() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: AssignStaffToSpecialtySchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Primero eliminar todo el staff existente de la especialidad
      const { error: deleteError } = await supabase
        .from('staff_specialties')
        .delete()
        .eq('specialty_id', data.specialty_id)

      if (deleteError) {
        throw new Error(`Error al eliminar staff existente: ${deleteError.message}`)
      }

      // Luego insertar el nuevo staff
      const staffSpecialties: TablesInsert<'staff_specialties'>[] = data.staff_ids.map(
        (staffId) => ({
          staff_id: staffId,
          specialty_id: data.specialty_id,
          tenant_id: currentTenant.id,
        })
      )

      const { error: insertError } = await supabase
        .from('staff_specialties')
        .insert(staffSpecialties)

      if (insertError) {
        throw new Error(`Error al asignar staff: ${insertError.message}`)
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-specialties'] })
      queryClient.invalidateQueries({ queryKey: ['specialties'] })
      toast.success('Staff asignado correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al asignar staff')
    },
  })
}
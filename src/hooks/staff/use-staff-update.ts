import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useStaffUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: TablesUpdate<'staff'> & { id: string; specialty_ids?: string[] }
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, specialty_ids, ...updateFields } = data
      const updateData: TablesUpdate<'staff'> = removeUndefined(updateFields)

      // Actualizar datos básicos del staff
      const { data: staff, error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar staff: ${error.message}`)
      }

      // Si se proporcionan specialty_ids, actualizar las relaciones
      if (specialty_ids !== undefined) {
        // Eliminar relaciones existentes
        const { error: deleteError } = await supabase
          .from('staff_specialties')
          .delete()
          .eq('staff_id', id)

        if (deleteError) {
          throw new Error(
            `Error al eliminar especialidades existentes: ${deleteError.message}`
          )
        }

        // Insertar nuevas relaciones si hay especialidades
        if (specialty_ids.length > 0) {
          const staffSpecialties = specialty_ids.map((specialtyId) => ({
            staff_id: id,
            specialty_id: specialtyId,
          }))

          const { error: insertError } = await supabase
            .from('staff_specialties')
            .insert(staffSpecialties)

          if (insertError) {
            throw new Error(
              `Error al asignar nuevas especialidades: ${insertError.message}`
            )
          }
        }
      }

      return staff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['staff_specialties'] })
      toast.success('Miembro del staff actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

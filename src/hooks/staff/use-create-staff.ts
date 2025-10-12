import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateStaffSchema } from '@/schemas/staff.schema'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useCreateStaff() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateStaffSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { specialty_ids, ...staffData } = data

      // Crear el staff primero
      const { data: staff, error } = await supabase
        .from('staff')
        .insert({
          ...staffData,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear staff: ${error.message}`)
      }

      // Si hay especialidades, crear las relaciones en staff_specialties
      if (specialty_ids && specialty_ids.length > 0) {
        const staffSpecialties = specialty_ids.map((specialtyId) => ({
          staff_id: staff.id,
          specialty_id: specialtyId,
        }))

        const { error: specialtyError } = await supabase
          .from('staff_specialties')
          .insert(staffSpecialties)

        if (specialtyError) {
          // Si falla la inserción de especialidades, eliminar el staff creado
          await supabase.from('staff').delete().eq('id', staff.id)
          throw new Error(
            `Error al asignar especialidades: ${specialtyError.message}`
          )
        }
      }

      return staff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['staff_specialties'] })
      toast.success('Miembro del staff creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

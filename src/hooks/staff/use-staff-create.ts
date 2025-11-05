import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export type CreateStaff = Omit<TablesInsert<'staff'>, 'tenant_id'>

export default function useStaffCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateStaff) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      console.log('data', data)
      // Crear el staff
      const { data: staff, error } = await supabase
        .from('staff')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear staff: ${error.message}`)
      }

      return staff
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [currentTenant?.id, 'staff'] })
      toast.success('Miembro del staff creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

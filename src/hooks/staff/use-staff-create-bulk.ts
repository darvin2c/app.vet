import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useStaffCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'staff'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const staffData: TablesInsert<'staff'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: staff, error } = await supabase
        .from('staff')
        .insert(staffData)
        .select()

      if (error) {
        throw new Error(`Error al crear personal: ${error.message}`)
      }

      return staff
    },
    onSuccess: (staff) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'staff'],
      })
      toast.success(`Se crearon ${staff.length} miembros del personal exitosamente`)
    },
    onError: (error) => {
      console.error('Error al crear personal:', error)
      toast.error(error.message || 'Error al crear personal')
    },
  })
}
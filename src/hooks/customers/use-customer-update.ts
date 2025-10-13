import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type UpdateCustomerData = Omit<TablesUpdate<'customers'>, 'tenant_id'> & {
  id: string
}

export default function useCustomerUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCustomerData) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: result, error } = await supabase
        .from('customers')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar cliente: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: [currentTenant?.id, 'customers'] })
      queryClient.invalidateQueries({ queryKey: [currentTenant?.id, 'customers', data.id] })

      toast.success('Cliente actualizado exitosamente', {
        description: `${data.first_name} ${data.last_name} ha sido actualizado`,
      })
    },
    onError: (error) => {
      toast.error('Error al actualizar cliente', {
        description: error.message,
      })
    },
  })
}
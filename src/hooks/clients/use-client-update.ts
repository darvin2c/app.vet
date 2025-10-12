import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type UpdateClientData = Omit<TablesUpdate<'clients'>, 'tenant_id'> & {
  id: string
}

export default function useClientUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateClientData) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: result, error } = await supabase
        .from('clients')
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
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', data.id] })

      toast.success('Cliente actualizado exitosamente', {
        description: `${data.full_name} ha sido actualizado`,
      })
    },
    onError: (error) => {
      toast.error('Error al actualizar cliente', {
        description: error.message,
      })
    },
  })
}

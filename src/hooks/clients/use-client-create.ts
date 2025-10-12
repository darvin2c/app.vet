import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type CreateClientData = Omit<TablesInsert<'clients'>, 'tenant_id'>

export default function useClientCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateClientData) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: result, error } = await supabase
        .from('clients')
        .insert({ ...data, tenant_id: currentTenant.id })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear cliente: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })

      toast.success('Cliente creado exitosamente', {
        description: `${data.full_name} ha sido registrado`,
      })
    },
    onError: (error) => {
      toast.error('Error al crear cliente', {
        description: error.message,
      })
    },
  })
}

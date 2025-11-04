import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { TablesInsert } from '@/types/supabase.types'

export default function usePaymentCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'payments'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      const { data: payment, error } = await supabase
        .from('payments')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear pago: ${error.message}`)
      }

      return payment
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'payments'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
      toast.success('Pago creado exitosamente')
    },
    onError: (error) => {
      console.error('Error al crear pago:', error)
      toast.error(error.message || 'Error al crear pago')
    },
  })
}

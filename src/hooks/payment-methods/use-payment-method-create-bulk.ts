import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function usePaymentMethodCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'payment_methods'>, 'tenant_id'>[]
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const paymentMethodData: TablesInsert<'payment_methods'>[] = data.map(
        (item) => ({
          ...item,
          tenant_id: currentTenant.id,
        })
      )

      const { data: paymentMethods, error } = await supabase
        .from('payment_methods')
        .insert(paymentMethodData)
        .select()

      if (error) {
        throw new Error(`Error al crear métodos de pago: ${error.message}`)
      }

      return paymentMethods
    },
    onSuccess: (paymentMethods) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'payment_methods'],
      })
      toast.success(
        `Se crearon ${paymentMethods.length} métodos de pago exitosamente`
      )
    },
    onError: (error) => {
      console.error('Error al crear métodos de pago:', error)
      toast.error(error.message || 'Error al crear métodos de pago')
    },
  })
}

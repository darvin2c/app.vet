import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function usePaymentMethodUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'payment_methods'>, 'tenant_id'>
    }) => {
      const { data: paymentMethod, error } = await supabase
        .from('payment_methods')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return paymentMethod
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'payment_methods'],
      })
      toast.success('Método de pago actualizado exitosamente')
    },
    onError: (error) => {
      console.error('Error al actualizar método de pago:', error)
      toast.error('Error al actualizar el método de pago')
    },
  })
}

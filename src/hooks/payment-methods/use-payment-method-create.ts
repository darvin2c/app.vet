import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

export function usePaymentMethodCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'payment_methods'>, 'tenant_id'>
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: paymentMethod, error } = await supabase
        .from('payment_methods')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
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
      toast.success('Método de pago creado exitosamente')
    },
    onError: (error) => {
      console.error('Error al crear método de pago:', error)
      toast.error('Error al crear el método de pago')
    },
  })
}

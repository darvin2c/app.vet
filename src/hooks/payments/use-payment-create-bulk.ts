'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { TablesInsert } from '@/types/supabase.types'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function usePaymentCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'payments'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      const { data: payments, error } = await supabase
        .from('payments')
        .insert(
          data.map((item) => ({
            ...item,
            tenant_id: currentTenant.id,
          }))
        )
        .select()

      if (error) {
        throw new Error(`Error al crear pagos: ${error.message}`)
      }

      return payments
    },
    onSuccess: (payments) => {
      // Invalidar las consultas relacionadas
      toast.success(`Se han creado ${payments.length} pagos exitosamente`)
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'payments'],
      })
      payments.forEach((payment) => {
        queryClient.invalidateQueries({
          queryKey: [currentTenant?.id, 'orders', payment.order_id],
        })
        queryClient.invalidateQueries({
          queryKey: [currentTenant?.id, 'orders', payment.order_id],
        })
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'orders'],
      })
    },
    onError: (error) => {
      console.error('Error al crear pagos:', error)
      toast.error(`Error al crear pagos`, {
        description: error.message,
      })
    },
  })
}

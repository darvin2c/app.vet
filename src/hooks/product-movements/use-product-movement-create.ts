import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'
import { TablesInsert } from '@/types/supabase.types'

export default function useProductMovementCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data:  Omit<TablesInsert<'product_movements'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }



      // Validar stock disponible para salidas (cantidad negativa)
      if (data.quantity < 0) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock, name')
          .eq('id', data.product_id)
          .eq('tenant_id', currentTenant.id)
          .single()

        if (productError) {
          throw new Error(
            `Error al verificar producto: ${productError.message}`
          )
        }

        const availableStock = product.stock || 0
        const requestedQuantity = Math.abs(data.quantity)

        if (availableStock < requestedQuantity) {
          throw new Error(
            `Stock insuficiente. Disponible: ${availableStock}, Solicitado: ${requestedQuantity}`
          )
        }
      }

      const { data: movement, error } = await supabase
        .from('product_movements')
        .insert({
          product_id: data.product_id,
          quantity: data.quantity,
          created_at: new Date().toISOString(),
          unit_cost: data.unit_cost || null,
          note: data.note || null,
          reference: data.reference || null,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear movimiento: ${error.message}`)
      }

      return movement
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ['product-movements'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Movimiento de producto creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear movimiento de producto')
    },
  })
}

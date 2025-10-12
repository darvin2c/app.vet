import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useDeleteProductMovement() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Obtener el movimiento antes de eliminarlo para recalcular stock
      const { data: movement, error: getError } = await supabase
        .from('product_movements')
        .select('product_id')
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .single()

      if (getError) {
        throw new Error(`Error al obtener movimiento: ${getError.message}`)
      }

      const { error } = await supabase
        .from('product_movements')
        .delete()
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)

      if (error) {
        throw new Error(`Error al eliminar movimiento: ${error.message}`)
      }

      // Recalcular stock del producto después de eliminar el movimiento
      const { error: recalcError } = await supabase.rpc(
        'recalc_product_stock',
        {
          p_product_id: movement.product_id,
        }
      )

      if (recalcError) {
        console.error('Error al recalcular stock:', recalcError)
        toast.error('Movimiento eliminado pero error al recalcular stock')
      }

      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-movements'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Movimiento de producto eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar movimiento de producto')
    },
  })
}

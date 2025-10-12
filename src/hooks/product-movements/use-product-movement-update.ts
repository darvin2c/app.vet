import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateProductMovementData } from '@/schemas/product-movements.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useProductMovementUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: UpdateProductMovementData
    }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: movement, error } = await supabase
        .from('product_movements')
        .update(data)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar movimiento: ${error.message}`)
      }

      return movement
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-movements'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Movimiento de producto actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar movimiento de producto')
    },
  })
}

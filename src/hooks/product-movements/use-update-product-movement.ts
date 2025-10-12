import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UpdateProductMovementSchema,
  UpdateProductMovementData,
} from '@/schemas/product-movements.schema'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useUpdateProductMovement() {
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

      // Obtener el movimiento actual para comparar cambios
      const { data: currentMovement, error: getCurrentError } = await supabase
        .from('product_movements')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .single()

      if (getCurrentError) {
        throw new Error(
          `Error al obtener movimiento: ${getCurrentError.message}`
        )
      }

      // Preparar datos de actualización
      const updateData: any = {}

      if (data.product_id !== undefined) updateData.product_id = data.product_id
      if (data.quantity !== undefined) updateData.quantity = data.quantity
      if (data.movement_date !== undefined) {
        updateData.movement_date = data.movement_date.toISOString()
      }
      if (data.unit_cost !== undefined) updateData.unit_cost = data.unit_cost
      if (data.total_cost !== undefined) updateData.total_cost = data.total_cost
      if (data.note !== undefined) updateData.note = data.note
      if (data.reference_type !== undefined)
        updateData.reference_type = data.reference_type
      if (data.reference_id !== undefined)
        updateData.reference_id = data.reference_id

      // Validar stock si se está cambiando la cantidad o el producto
      if (data.quantity !== undefined && data.quantity < 0) {
        const productId = data.product_id || currentMovement.product_id

        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock, name')
          .eq('id', productId)
          .eq('tenant_id', currentTenant.id)
          .single()

        if (productError) {
          throw new Error(
            `Error al verificar producto: ${productError.message}`
          )
        }

        // Calcular stock disponible considerando el movimiento actual
        const currentQuantity = currentMovement.quantity
        const newQuantity = data.quantity
        const quantityDifference = newQuantity - currentQuantity

        const availableStock = (product.stock || 0) - quantityDifference
        const requestedQuantity = Math.abs(newQuantity)

        if (availableStock < 0) {
          throw new Error(
            `Stock insuficiente después de la actualización. Stock actual: ${product.stock || 0}`
          )
        }
      }

      const { data: movement, error } = await supabase
        .from('product_movements')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar movimiento: ${error.message}`)
      }

      // Recalcular stock si cambió la cantidad o el producto
      if (data.quantity !== undefined || data.product_id !== undefined) {
        const productsToRecalc = [currentMovement.product_id]
        if (data.product_id && data.product_id !== currentMovement.product_id) {
          productsToRecalc.push(data.product_id)
        }

        for (const productId of productsToRecalc) {
          const { error: recalcError } = await supabase.rpc(
            'recalc_product_stock',
            {
              p_product_id: productId,
            }
          )

          if (recalcError) {
            console.error('Error al recalcular stock:', recalcError)
          }
        }
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

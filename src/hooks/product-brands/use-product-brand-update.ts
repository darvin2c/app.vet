import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type UpdateProductBrandData = Omit<TablesUpdate<'product_brands'>, 'tenant_id'>

export default function useProductBrandUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: UpdateProductBrandData & { id: string }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { id, ...updateFields } = data
      const updateData: UpdateProductBrandData = updateFields

      const { data: result, error } = await supabase
        .from('product_brands')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar marca: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'product-brands'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'product-brand', data.id],
      })

      toast.success('Marca actualizada exitosamente', {
        description: `${data.name} ha sido actualizada`,
      })
    },
    onError: (error) => {
      toast.error('Error al actualizar marca', {
        description: error.message,
      })
    },
  })
}

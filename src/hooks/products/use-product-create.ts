import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateProductSchema } from '@/schemas/products.schema'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useProductCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateProductSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const productData: TablesInsert<'products'> = {
        name: data.name,
        sku: data.sku,
        category_id: data.category_id,
        unit_id: data.unit_id,
        min_stock: data.min_stock,
        stock: data.stock,
        is_active: data.is_active ?? true,
        tenant_id: currentTenant.id,
      }

      const { data: product, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear producto: ${error.message}`)
      }

      return product
    },
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Producto creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear producto')
    },
  })
}

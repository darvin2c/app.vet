import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useProductCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'products'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const productData: TablesInsert<'products'> = {
        ...data,
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
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'products'],
      })
      toast.success('Producto creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear producto')
    },
  })
}

export function useProductCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'products'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const productData: TablesInsert<'products'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: products, error } = await supabase
        .from('products')
        .insert(productData)
        .select()

      if (error) {
        throw new Error(`Error al crear productos: ${error.message}`)
      }

      return products
    },
    onSuccess: (products) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'products'],
      })
      toast.success(`Se crearon ${products.length} productos exitosamente`)
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear productos')
    },
  })
}

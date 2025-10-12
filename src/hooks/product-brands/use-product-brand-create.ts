import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type CreateProductBrandData = Omit<TablesInsert<'product_brands'>, 'tenant_id'>

export default function useProductBrandCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateProductBrandData) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: result, error } = await supabase
        .from('product_brands')
        .insert({ ...data, tenant_id: currentTenant.id })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear marca: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['product-brands'] })

      toast.success('Marca creada exitosamente', {
        description: `${data.name} ha sido registrada`,
      })
    },
    onError: (error) => {
      toast.error('Error al crear marca', {
        description: error.message,
      })
    },
  })
}

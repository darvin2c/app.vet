import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { CreateSupplierBrandSchema } from '@/schemas/supplier-brands.schema'
import { TablesInsert } from '@/types/supabase.types'

export default function useSupplierBrandCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateSupplierBrandSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const supplierBrandData: TablesInsert<'supplier_brands'> = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: result, error } = await supabase
        .from('supplier_brands')
        .insert(supplierBrandData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al asignar marca al proveedor: ${error.message}`)
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-brands'] })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['product-brands'] })
      toast.success('Marca asignada al proveedor exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

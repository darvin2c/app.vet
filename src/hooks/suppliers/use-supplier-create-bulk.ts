import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type CreateSupplierData = Omit<TablesInsert<'suppliers'>, 'tenant_id'>

export function useSupplierCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreateSupplierData[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const supplierData: TablesInsert<'suppliers'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: suppliers, error } = await supabase
        .from('suppliers')
        .insert(supplierData)
        .select()

      if (error) {
        throw new Error(`Error al crear proveedores: ${error.message}`)
      }

      return suppliers
    },
    onSuccess: (suppliers) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'suppliers'],
      })
      toast.success(`Se crearon ${suppliers.length} proveedores exitosamente`)
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear proveedores')
    },
  })
}

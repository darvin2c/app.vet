import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { CreateSupplierSchema } from '@/schemas/suppliers.schema'
import { TablesInsert } from '@/types/supabase.types'
import { useCurrentTenantStore } from '@/stores/current-tenant-store'
import { toast } from 'sonner'

export default function useSupplierCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'suppliers'>, 'tenant_id'>) => {
      if (!currentTenant) {
        throw new Error('No hay tenant seleccionado')
      }

      const supplierData = {
        ...data,
        tenant_id: currentTenant.id,
      }

      const { data: supplier, error } = await supabase
        .from('suppliers')
        .insert(supplierData)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear proveedor: ${error.message}`)
      }

      return supplier
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Proveedor creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear proveedor')
    },
  })
}
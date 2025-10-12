import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AssignSuppliersToBrandSchema } from '@/schemas/supplier-brands.schema'
import { TablesInsert } from '@/types/supabase.types'

export default function useAssignSuppliersToBrand() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: AssignSuppliersToBrandSchema) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      // Primero eliminar las asignaciones existentes
      const { error: deleteError } = await supabase
        .from('supplier_brands')
        .delete()
        .eq('brand_id', data.brand_id)

      if (deleteError) {
        throw new Error(`Error al eliminar asignaciones existentes: ${deleteError.message}`)
      }

      // Crear las nuevas asignaciones
      const supplierBrandsData: TablesInsert<'supplier_brands'>[] = data.supplier_ids.map(
        (supplierId) => ({
          supplier_id: supplierId,
          brand_id: data.brand_id,
          tenant_id: currentTenant.id,
        })
      )

      const { error: insertError } = await supabase
        .from('supplier_brands')
        .insert(supplierBrandsData)

      if (insertError) {
        throw new Error(`Error al asignar proveedores a la marca: ${insertError.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-brands'] })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['product-brands'] })
      toast.success('Proveedores asignados a la marca exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
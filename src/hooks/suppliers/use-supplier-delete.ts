import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export default function useSupplierDelete() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('suppliers').delete().eq('id', id)

      if (error) {
        throw new Error(`Error al eliminar proveedor: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'suppliers'],
      })
      toast.success('Proveedor eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar proveedor')
    },
  })
}

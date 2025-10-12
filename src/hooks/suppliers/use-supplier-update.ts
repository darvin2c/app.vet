import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'

interface UpdateSupplierParams {
  id: string
  data: Omit<TablesUpdate<'suppliers'>, 'tenant_id'>
}

export default function useSupplierUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: UpdateSupplierParams) => {
      const { data: supplier, error } = await supabase
        .from('suppliers')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar proveedor: ${error.message}`)
      }

      return supplier
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      toast.success('Proveedor actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar proveedor')
    },
  })
}

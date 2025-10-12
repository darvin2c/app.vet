import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteSupplierBrandParams {
  supplierId: string
  brandId: string
}

export default function useSupplierBrandDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ supplierId, brandId }: DeleteSupplierBrandParams) => {
      const { error } = await supabase
        .from('supplier_brands')
        .delete()
        .eq('supplier_id', supplierId)
        .eq('brand_id', brandId)

      if (error) {
        throw new Error(`Error al desasignar marca del proveedor: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-brands'] })
      queryClient.invalidateQueries({ queryKey: ['suppliers'] })
      queryClient.invalidateQueries({ queryKey: ['product-brands'] })
      toast.success('Marca desasignada del proveedor exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
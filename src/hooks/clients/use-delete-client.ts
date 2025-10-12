import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useDeleteClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Error al eliminar cliente: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      
      toast.success('Cliente eliminado exitosamente')
    },
    onError: (error) => {
      toast.error('Error al eliminar cliente', {
        description: error.message,
      })
    },
  })
}
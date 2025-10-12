import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useDeletePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('pets').delete().eq('id', id)

      if (error) {
        throw new Error(`Error al eliminar mascota: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast.success('Mascota eliminada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

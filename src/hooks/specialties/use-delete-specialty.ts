import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useDeleteSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('specialties').delete().eq('id', id)

      if (error) {
        throw new Error(`Error al eliminar especialidad: ${error.message}`)
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] })
      toast.success('Especialidad eliminada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

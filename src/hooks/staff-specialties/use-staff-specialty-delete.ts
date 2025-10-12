import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useStaffSpecialtyDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      staffId,
      specialtyId,
    }: {
      staffId: string
      specialtyId: string
    }) => {
      const { error } = await supabase
        .from('staff_specialties')
        .delete()
        .eq('staff_id', staffId)
        .eq('specialty_id', specialtyId)

      if (error) {
        throw new Error(
          `Error al eliminar relación staff-especialidad: ${error.message}`
        )
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-specialties'] })
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['specialties'] })
      toast.success('Especialidad desasignada correctamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al desasignar especialidad')
    },
  })
}

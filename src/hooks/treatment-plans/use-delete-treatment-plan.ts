import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function useDeleteTreatmentPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('treatment_plans')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(
          `Error al eliminar plan de tratamiento: ${error.message}`
        )
      }

      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['patient-treatment-plans'] })
      toast.success('Plan de tratamiento eliminado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar el plan de tratamiento')
    },
  })
}

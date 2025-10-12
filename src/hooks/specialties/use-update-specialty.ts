import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesUpdate } from '@/types/supabase.types'
import { removeUndefined } from '@/lib/utils'
import { toast } from 'sonner'

export default function useUpdateSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TablesUpdate<'specialties'> & { id: string }) => {
      const { id, ...updateFields } = data
      const updateData: TablesUpdate<'specialties'> =
        removeUndefined(updateFields)

      const { data: specialty, error } = await supabase
        .from('specialties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar especialidad: ${error.message}`)
      }

      return specialty
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] })
      toast.success('Especialidad actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

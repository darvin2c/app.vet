import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { UpdatePetSchema } from '@/schemas/pets.schema'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'

export function useUpdatePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Omit<TablesUpdate<'pets'>, 'tenant_id'>
    }) => {
      const { data: pet, error } = await supabase
        .from('pets')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar mascota: ${error.message}`)
      }

      return pet
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      queryClient.invalidateQueries({ queryKey: ['pet', id] })
      toast.success('Mascota actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

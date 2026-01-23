import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'

export function useDewormingUpdate() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: TablesUpdate<'pet_dewormings'>
    }) => {
      const { data: deworming, error } = await supabase
        .from('pet_dewormings')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return deworming
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-records'],
      })
    },
  })
}

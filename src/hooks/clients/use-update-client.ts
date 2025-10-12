import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { TablesUpdate } from '@/types/supabase.types'
import { toast } from 'sonner'

type UpdateClientData = Omit<TablesUpdate<'clients'>, 'tenant_id'> & {
  id: string
}

export function useUpdateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateClientData) => {
      const { data: result, error } = await supabase
        .from('clients')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar cliente: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', data.id] })
      
      toast.success('Cliente actualizado exitosamente', {
        description: `${data.first_name} ${data.last_name} ha sido actualizado`,
      })
    },
    onError: (error) => {
      toast.error('Error al actualizar cliente', {
        description: error.message,
      })
    },
  })
}
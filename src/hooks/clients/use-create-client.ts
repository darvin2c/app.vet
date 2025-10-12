import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'

type CreateClientData = Omit<TablesInsert<'clients'>, 'tenant_id'>

export function useCreateClient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateClientData) => {
      const { data: result, error } = await supabase
        .from('clients')
        .insert(data)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear cliente: ${error.message}`)
      }

      return result
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      
      toast.success('Cliente creado exitosamente', {
        description: `${data.first_name} ${data.last_name} ha sido registrado`,
      })
    },
    onError: (error) => {
      toast.error('Error al crear cliente', {
        description: error.message,
      })
    },
  })
}
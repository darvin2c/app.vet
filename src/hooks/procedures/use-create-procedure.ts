import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export default function useCreateProcedure() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'procedures'>, 'tenant_id'>) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { data: procedure, error } = await supabase
        .from('procedures')
        .insert({
          ...data,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear procedimiento: ${error.message}`)
      }

      return procedure
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedures'] })
      toast.success('Procedimiento creado exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

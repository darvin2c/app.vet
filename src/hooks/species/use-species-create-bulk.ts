import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useSpeciesCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'species'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const speciesData: TablesInsert<'species'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: species, error } = await supabase
        .from('species')
        .insert(speciesData)
        .select()

      if (error) {
        throw new Error(`Error al crear especies: ${error.message}`)
      }

      return species
    },
    onSuccess: (species) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'species'],
      })
      toast.success(`Se crearon ${species.length} especies exitosamente`)
    },
    onError: (error) => {
      console.error('Error al crear especies:', error)
      toast.error('Error al crear especies', {
        description: error.message,
      })
    },
  })
}

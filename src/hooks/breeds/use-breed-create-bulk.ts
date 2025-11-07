import { supabase } from '@/lib/supabase/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { toast } from 'sonner'

// Crea múltiples razas en una sola operación
// Usa query keys basadas en tenant y feature, conforme a las reglas del proyecto
export function useBreedCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'breeds'>, 'tenant_id'>[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const breedData: TablesInsert<'breeds'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: breeds, error } = await supabase
        .from('breeds')
        .insert(breedData)
        .select()

      if (error) {
        throw new Error(`Error al crear razas: ${error.message}`)
      }

      return breeds
    },
    onSuccess: (breeds) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'species'],
      })

      toast.success(`Se crearon ${breeds?.length ?? 0} razas exitosamente`)
    },
    onError: (error) => {
      console.error('Error al crear razas:', error)
      toast.error('Error al crear razas', {
        description: error.message,
      })
    },
  })
}

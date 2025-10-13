import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { BreedUpdate } from '@/schemas/breeds.schema'

export function useBreedUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BreedUpdate }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const updateData: TablesUpdate<'breeds'> = {
        ...data,
        updated_at: new Date().toISOString(),
      }

      const { data: breed, error } = await supabase
        .from('breeds')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar raza: ${error.message}`)
      }

      return breed
    },
    onSuccess: (breed) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds', breed.species_id],
      })
    },
  })
}

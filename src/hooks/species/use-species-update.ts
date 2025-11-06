import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesUpdate } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { SpeciesUpdate } from '@/schemas/species.schema'
import { toast } from 'sonner'

export function useSpeciesUpdate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SpeciesUpdate }) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const updateData: TablesUpdate<'species'> = {
        ...data,
        updated_at: new Date().toISOString(),
      }

      const { data: species, error } = await supabase
        .from('species')
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', currentTenant.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error al actualizar especie: ${error.message}`)
      }

      return species
    },
    onSuccess: (species) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'species'],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'species', species.id],
      })
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'breeds'],
      })
      toast.success('Especie actualizada exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al actualizar especie`, {
        description: error.message,
      })
    },
  })
}

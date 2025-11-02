import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

type CreatePetData = Omit<TablesInsert<'pets'>, 'tenant_id'>

export function usePetCreateBulk() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()

  return useMutation({
    mutationFn: async (data: CreatePetData[]) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const petData: TablesInsert<'pets'>[] = data.map((item) => ({
        ...item,
        tenant_id: currentTenant.id,
      }))

      const { data: pets, error } = await supabase
        .from('pets')
        .insert(petData)
        .select()

      if (error) {
        throw new Error(`Error al crear mascotas: ${error.message}`)
      }

      return pets
    },
    onSuccess: (pets) => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'pets'],
      })
      toast.success(`Se crearon ${pets.length} mascotas exitosamente`)
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear mascotas')
    },
  })
}

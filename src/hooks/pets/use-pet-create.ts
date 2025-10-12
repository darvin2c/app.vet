import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { CreatePetSchema } from '@/schemas/pets.schema'
import { TablesInsert } from '@/types/supabase.types'
import { toast } from 'sonner'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'

export function useCreatePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<TablesInsert<'pets'>, 'tenant_id'>) => {
      const { currentTenant } = useCurrentTenantStore()
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }
      const { data: pet, error } = await supabase
        .from('pets')
        .insert({ ...data, tenant_id: currentTenant.id })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear mascota: ${error.message}`)
      }

      return pet
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast.success('Mascota creada exitosamente')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

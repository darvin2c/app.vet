import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { TablesInsert } from '@/types/supabase.types'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'
import { toast } from 'sonner'

export function useVaccinationCreate() {
  const queryClient = useQueryClient()
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (
      data: Omit<TablesInsert<'pet_vaccinations'>, 'tenant_id'> & {
        items?: {
          product_id: string
          qty: number
          unit_price?: number
          discount?: number
          notes?: string
        }[]
      }
    ) => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      const { items, ...vaccinationData } = data

      const { data: vaccination, error } = await supabase
        .from('pet_vaccinations')
        .insert({
          ...vaccinationData,
          tenant_id: currentTenant.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      if (items && items.length > 0) {
        const itemsToInsert = items.map((item) => ({
          record_id: vaccinationData.clinical_record_id,
          product_id: item.product_id,
          qty: item.qty,
          unit_price: item.unit_price || 0,
          discount: item.discount || 0,
          notes: item.notes,
          tenant_id: currentTenant.id,
        }))

        const { error: itemsError } = await supabase
          .from('record_items')
          .insert(itemsToInsert)

        if (itemsError) throw itemsError
      }

      return vaccination
    },
    onSuccess: () => {
      toast.success('Vacunación registrada exitosamente')
      queryClient.invalidateQueries({
        queryKey: [currentTenant?.id, 'clinical_records'],
      })
    },
    onError: (error) => {
      console.error('Error al registrar la vacunación', error)
      toast.error('Error al registrar la vacunación', {
        description: error.message,
      })
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import useCurrentTenantStore from '@/hooks/tenants/use-current-tenant-store'

interface UseMedicalRecordListParams {
  petId: string
  filters?: AppliedFilter[]
  search?: string
  orders?: AppliedSort[]
}

export function useMedicalRecordList({
  petId,
  filters = [],
  search,
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
}: UseMedicalRecordListParams) {
  const { currentTenant } = useCurrentTenantStore()
  const supabase = createClient()

  return useQuery({
    queryKey: [currentTenant?.id, 'clinical_records', filters, search, orders],
    queryFn: async () => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('clinical_records')
        .select(
          `
          *,
          pets (
            *
          ),
          staff (
            *
          ),
          clinical_parameters (
            *
          ),
          clinical_notes (
            *
          ),
          vaccinations (
            *
          ),
          record_items (
            *,
            products (
              *
            )
          )
        `
        )
        .eq('tenant_id', currentTenant.id)
        .eq('pet_id', petId)

      // Aplicar búsqueda
      if (search) {
      }

      // Aplicar filtros
      filters.forEach((filter) => {
        query = query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamiento

      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener registros médicos: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}

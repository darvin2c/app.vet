import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'
import { toast } from 'sonner'

export default function useProductUnitList({
  filters = [],
  orders = [],
  search,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery({
    queryKey: [currentTenant?.id, 'product-units', filters, orders, search],
    queryFn: async () => {
      if (!currentTenant?.id) {
        throw new Error('No hay tenant seleccionado')
      }

      let query = supabase
        .from('product_units')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      filters.forEach((filter) => {
        query.filter(filter.field, filter.operator, filter.value)
      })

      // Aplicar ordenamientos
      orders.forEach((order) => {
        query.order(order.field, { ascending: order.ascending })
      })

      // Aplicar búsqueda
      if (search) {
        query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(
          `Error al obtener unidades de productos: ${error.message}`
        )
      }

      return data
    },
  })
}

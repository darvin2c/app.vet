import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'
import { Enums, Tables } from '@/types/supabase.types'
import useCurrentTenantStore from '../tenants/use-current-tenant-store'
import { AppliedFilter } from '@/components/ui/filters'
import { AppliedSort } from '@/components/ui/order-by'

type Payment = Tables<'payments'>

export type PaymentWithRelations = Payment & {
  payment_methods?: {
    id: string
    name: string
    payment_type: Enums<'payment_type'>
  } | null
  customers?: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
  } | null
  orders?: {
    id: string
    order_number: string | null
    total: number | null
    status: Enums<'order_status'>
  } | null
}

export default function usePaymentList({
  filters = [],
  orders = [
    {
      field: 'created_at',
      direction: 'desc',
    },
  ],
  search,
}: {
  filters?: AppliedFilter[]
  orders?: AppliedSort[]
  search?: string
}) {
  const { currentTenant } = useCurrentTenantStore()

  return useQuery<PaymentWithRelations[]>({
    queryKey: [currentTenant?.id, 'payments', filters, search, orders],
    queryFn: async (): Promise<PaymentWithRelations[]> => {
      if (!currentTenant?.id) {
        return []
      }

      let query = supabase
        .from('payments')
        .select(
          `
          *,
          payment_methods (
            id,
            name,
            payment_type
          ),
          customers (
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          orders (
            id,
            order_number,
            total,
            status
          )
        `
        )
        .eq('tenant_id', currentTenant.id)

      filters.forEach((filter) => {
        query.filter(filter.field, filter.operator, filter.value)
      })

      if (search) {
        query = query.or(
          `reference.ilike.%${search}%,notes.ilike.%${search}%,customers.first_name.ilike.%${search}%,customers.last_name.ilike.%${search}%`
        )
      }

      orders.forEach((order) => {
        query = query.order(order.field, {
          ascending: order.direction === 'asc',
        })
      })

      const { data, error } = await query

      if (error) {
        throw new Error(`Error al obtener pagos: ${error.message}`)
      }

      return data
    },
    enabled: !!currentTenant?.id,
  })
}

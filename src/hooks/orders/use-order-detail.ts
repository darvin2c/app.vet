import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export default function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: [orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(
          '*, customer:customer_id(*), payments(*), order_items(*, products(*))'
        )
        .eq('id', orderId)
        .single()

      if (error) {
        throw error
      }

      return data
    },
  })
}

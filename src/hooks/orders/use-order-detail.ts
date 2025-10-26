import { supabase } from '@/lib/supabase/client'
import { useQuery } from '@tanstack/react-query'

export default function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: [orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, customer:custumer_id(*), payments(*), items:order_items(*, products(*))')
        .eq('id', orderId)
        .single()

      if (error) {
        throw error
      }

      return data
    },
  })
}

'use client'

import { useEffect, useState } from 'react'
import { OrderPrint } from '@/components/orders/order-print'
import { Tables } from '@/types/supabase.types'
import { supabase } from '@/lib/supabase/client'

interface PrintPageProps {
  params: {
    orderId: string
  }
}

export default function PrintPage({ params }: PrintPageProps) {
  const [order, setOrder] = useState<Tables<'orders'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.orderId)
          .single()

        if (error) {
          setError('Error al cargar la orden')
          console.error('Error fetching order:', error)
          return
        }

        setOrder(data)
      } catch (err) {
        setError('Error al cargar la orden')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando orden...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Orden no encontrada'}</p>
          <p className="text-gray-600">ID de orden: {params.orderId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4;
                margin: 0.5in;
              }
              
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                margin: 0;
                padding: 0;
              }
              
              .print-page {
                margin: 0;
                padding: 0;
                box-shadow: none;
              }
            }
            
            .print-page {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20px;
              background: white;
              min-height: 100vh;
            }
          `,
        }}
      />

      <div className="print-page">
        <OrderPrint order={order} />
      </div>
    </div>
  )
}

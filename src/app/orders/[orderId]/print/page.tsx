import { OrderPrint } from '@/components/orders/order-print'
import { use } from 'react'

export default function PrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{ view?: 'full' | 'ticket' }>
}) {
  const { orderId } = use(params)
  const { view = 'full' } = use(searchParams)

  return (
    <div className="min-h-screen bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: ${view === 'ticket' ? '80mm 200mm' : 'A4'};
                margin: ${view === 'ticket' ? '0.2in' : '0.5in'};
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
              max-width: ${view === 'ticket' ? '80mm' : '210mm'};
              margin: 0 auto;
              padding: ${view === 'ticket' ? '10px' : '20px'};
              background: white;
              min-height: 100vh;
            }
          `,
        }}
      />

      <div className="print-page">
        <OrderPrint orderId={orderId} view={view} />
      </div>
    </div>
  )
}

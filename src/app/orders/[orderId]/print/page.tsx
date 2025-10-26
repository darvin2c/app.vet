import { OrderPrint } from '@/components/orders/order-print'
import { use } from 'react'

export default function PrintPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
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
        <OrderPrint orderId={orderId} />
      </div>
    </div>
  )
}

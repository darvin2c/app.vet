'use client'

import useOrderDetail from '@/hooks/orders/use-order-detail'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export function OrderPrint({ orderId }: { orderId: string }) {
  const { data: order } = useOrderDetail(orderId)

  if (!order) {
    return null
  }

  return (
    <div className="order-print font-sans text-xs leading-relaxed text-black bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .order-print {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #000;
            background: white;
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 40px;
          }
          
          .order-print .header {
            text-align: center;
            margin-bottom: 60px;
          }
          
          .order-print .header h1 {
            font-size: 28px;
            font-weight: 400;
            margin: 0 0 8px 0;
            letter-spacing: 0.5px;
          }
          
          .order-print .header p {
            font-size: 16px;
            margin: 0;
            font-weight: 300;
            color: #666;
          }
          
          .order-print .divider {
            height: 1px;
            background: #e5e5e5;
            margin: 40px 0;
          }
          
          .order-print .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            margin-bottom: 60px;
          }
          
          .order-print .info-section h3 {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 20px 0;
            color: #000;
          }
          
          .order-print .info-section p {
            margin: 8px 0;
            font-size: 14px;
            color: #333;
          }
          
          .order-print .info-section strong {
            font-weight: 500;
            color: #000;
          }
          
          .order-print .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 60px;
          }
          
          .order-print .items-table th {
            font-size: 14px;
            font-weight: 500;
            padding: 16px 0;
            text-align: left;
            border-bottom: 1px solid #e5e5e5;
            color: #000;
          }
          
          .order-print .items-table td {
            padding: 16px 0;
            font-size: 14px;
            border-bottom: 1px solid #f5f5f5;
            color: #333;
          }
          
          .order-print .items-table td.text-center {
            text-align: center;
            color: #999;
            font-style: normal;
          }
          
          .order-print .totals {
            margin-left: auto;
            width: 280px;
          }
          
          .order-print .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 14px;
          }
          
          .order-print .total-row:not(:last-child) {
            border-bottom: 1px solid #f5f5f5;
          }
          
          .order-print .total-row.final {
            border-top: 1px solid #e5e5e5;
            margin-top: 8px;
            padding-top: 16px;
            font-weight: 500;
            font-size: 16px;
          }
          
          .order-print .notes {
            margin-top: 60px;
          }
          
          .order-print .notes h3 {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 16px 0;
            color: #000;
          }
          
          .order-print .notes p {
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin: 0;
          }
          
          @media print {
            .order-print {
              font-size: 12px;
              padding: 40px 20px;
            }
            
            .order-print .header h1 {
              font-size: 24px;
            }
            
            .order-print .info-section h3,
            .order-print .notes h3 {
              font-size: 14px;
            }
            
            .order-print .total-row.final {
              font-size: 14px;
            }
            
            @page {
              size: A4;
              margin: 15mm;
            }
          }
        `,
        }}
      />

      <div className="header">
        <h1>ORDEN DE SERVICIO</h1>
        <p>#{order.order_number}</p>
      </div>

      <div className="divider"></div>

      <div className="info-grid">
        <div className="info-section">
          <h3>Información de la Orden</h3>
          <p>
            <strong>Fecha:</strong>{' '}
            {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', {
              locale: es,
            })}
          </p>
          <p>
            <strong>Estado:</strong> {order.status}
          </p>
          {order.custumer_id && (
            <p>
              <strong>Cliente:</strong> {order.custumer_id}
            </p>
          )}
        </div>
        <div className="info-section">
          <h3>Detalles Financieros</h3>
          <p>
            <strong>Subtotal:</strong> S/ {(order.subtotal || 0).toFixed(2)}
          </p>
          <p>
            <strong>Impuestos:</strong> S/ {(order.tax || 0).toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> S/ {(order.total || 0).toFixed(2)}
          </p>
          <p>
            <strong>Pagado:</strong> S/ {(order.paid_amount || 0).toFixed(2)}
          </p>
          <p>
            <strong>Balance:</strong> S/ {(order.balance || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabla de items */}
      <table className="items-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4} className="text-center">
              Items de la orden (pendiente de implementar)
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totales */}
      <div className="totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>S/ {(order.subtotal || 0).toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Impuestos:</span>
          <span>S/ {(order.tax || 0).toFixed(2)}</span>
        </div>
        <div className="total-row final">
          <span>Total:</span>
          <span>S/ {(order.total || 0).toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Pagado:</span>
          <span>S/ {(order.paid_amount || 0).toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Balance:</span>
          <span>S/ {(order.balance || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Notas */}
      {order.notes && (
        <div className="notes">
          <h3>Notas:</h3>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  )
}

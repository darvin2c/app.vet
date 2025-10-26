'use client'

import { Tables } from '@/types/supabase.types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderPrintProps {
  order: Tables<'orders'>
}

export function OrderPrint({ order }: OrderPrintProps) {
  return (
    <div className="order-print font-sans text-xs leading-relaxed text-black bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .order-print {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            background: white;
          }
          
          .order-print .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .order-print .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          
          .order-print .header p {
            font-size: 18px;
            margin: 0;
          }
          
          .order-print .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          
          .order-print .order-info h3 {
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .order-print .order-info p {
            margin: 4px 0;
            font-size: 12px;
          }
          
          .order-print .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .order-print .items-table th,
          .order-print .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          .order-print .items-table th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
          
          .order-print .items-table td.text-center {
            text-align: center;
            color: #666;
            font-style: italic;
          }
          
          .order-print .totals {
            margin-left: auto;
            width: 300px;
          }
          
          .order-print .total-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          
          .order-print .total-row.final {
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            font-weight: bold;
            font-size: 14px;
            margin-top: 5px;
          }
          
          .order-print .notes {
            margin-top: 24px;
          }
          
          .order-print .notes h3 {
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          .order-print .notes p {
            font-size: 12px;
            line-height: 1.5;
          }
          
          @media print {
            .order-print {
              font-size: 11px;
            }
            
            @page {
              size: A4;
              margin: 2cm;
            }
          }
        `,
        }}
      />

      <div className="header">
        <h1>ORDEN DE SERVICIO</h1>
        <p>#{order.order_number}</p>
      </div>

      <div className="order-info">
        <div>
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
        <div>
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

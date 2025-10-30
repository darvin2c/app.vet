'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import useOrderDetail from '@/hooks/orders/use-order-detail'
import { DateDisplay } from '../ui/date-picker'
import { Button } from '@/components/ui/button'
import { FileText, Receipt, Printer } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'

type OrderPrintProps = {
  orderId: string
  view?: 'full' | 'ticket'
}

export function OrderPrint({
  orderId,
  view: initialView = 'full',
}: OrderPrintProps) {
  const { data: order } = useOrderDetail(orderId)
  const [currentView, setCurrentView] = useState<'full' | 'ticket'>(initialView)
  const printRef = useRef<HTMLDivElement>(null)

  // Configurar react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Orden ${order?.order_number || orderId}`,
    pageStyle: `
      @page {
        size: ${currentView === 'ticket' ? '80mm auto' : 'A4'};
        margin: ${currentView === 'ticket' ? '5mm' : '10mm'};
      }
      @media print {
        body { 
          font-family: 'Inter', sans-serif;
          font-size: ${currentView === 'ticket' ? '12px' : '14px'};
          line-height: 1.4;
        }
        .print-hide { display: none !important; }
        .print-show { display: block !important; }
      }
    `,
  })

  // Actualizar vista cuando cambie el prop
  useEffect(() => {
    setCurrentView(initialView)
  }, [initialView])

  const PEN = useMemo(
    () =>
      new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2,
      }),
    []
  )

  if (!order) return null

  const subtotal = order.subtotal ?? 0
  const tax = order.tax ?? 0
  const total = order.total ?? subtotal + tax
  const paid = order.paid_amount ?? 0
  const balance = order.balance ?? Math.max(total - paid, 0)

  // Clases base comunes
  const baseClasses = 'font-sans text-black bg-white w-full'

  // Clases específicas por vista
  const viewClasses = {
    full: 'max-w-4xl mx-auto p-8 sm:p-12 lg:p-16 text-sm leading-relaxed print:p-6 print:text-xs print:max-w-none print:mx-0',
    ticket: 'max-w-xs mx-auto p-4 text-xs leading-tight',
  }

  return (
    <div className="w-full">
      {/* Controles de vista e impresión */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg print-hide">
        <div className="flex gap-2">
          <Button
            variant={currentView === 'full' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('full')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Vista Completa
          </Button>
          <Button
            variant={currentView === 'ticket' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('ticket')}
            className="flex items-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            Vista Ticket
          </Button>
        </div>
        <Button
          onClick={handlePrint}
          size="sm"
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {/* Contenido de impresión */}
        <div ref={printRef}>
          {currentView === 'ticket' ? (
            <div className={`${baseClasses} ${viewClasses.ticket}`}>
              {/* Header - Ticket */}
              <div className="text-center mb-4 border-b border-gray-300 pb-3">
                <h1 className="text-sm font-semibold mb-1 tracking-wide">
                  ORDEN DE SERVICIO
                </h1>
                <p className="text-xs text-gray-600">#{order.order_number}</p>
              </div>

              {/* Info básica - Ticket */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">Fecha:</span>
                  <span>
                    <DateDisplay value={order.created_at} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estado:</span>
                  <span>{order.status}</span>
                </div>
                {!!order.customer_id && (
                  <div className="flex justify-between">
                    <span className="font-medium">Cliente:</span>
                    <span className="truncate ml-2">{order.customer_id}</span>
                  </div>
                )}
              </div>

              {/* Items - Ticket (Lista compacta) */}
              <div className="border-t border-gray-300 pt-3 mb-4">
                <h3 className="text-xs font-semibold mb-2">ITEMS:</h3>
                <div className="space-y-2">
                  {Array.isArray(order.order_items) &&
                  order.order_items.length > 0 ? (
                    order.order_items.map((it: any, idx: number) => {
                      const qty = it.quantity ?? 0
                      const unit = it.unit_price ?? 0
                      const line = it.total ?? qty * unit
                      return (
                        <div key={it.id ?? idx} className="text-xs">
                          <div className="font-medium truncate">
                            {it.description ?? it.name ?? '-'}
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>
                              {qty} x {PEN.format(unit)}
                            </span>
                            <span className="font-medium">
                              {PEN.format(line)}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-500 text-xs py-2">
                      Items pendientes
                    </div>
                  )}
                </div>
              </div>

              {/* Totales - Ticket */}
              <div className="border-t border-gray-300 pt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{PEN.format(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span>{PEN.format(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-sm border-t border-gray-300 pt-1 mt-2">
                  <span>TOTAL:</span>
                  <span>{PEN.format(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pagado:</span>
                  <span>{PEN.format(paid)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Balance:</span>
                  <span>{PEN.format(balance)}</span>
                </div>
              </div>

              {/* Notas - Ticket */}
              {!!order.notes && (
                <div className="border-t border-gray-300 pt-3 mt-4">
                  <h3 className="text-xs font-semibold mb-1">NOTAS:</h3>
                  <p className="text-xs text-gray-700 leading-tight">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Vista completa (full)
            <div className={`${baseClasses} ${viewClasses.full}`}>
              {/* Header - Full */}
              <div className="text-center mb-12 print:mb-8">
                <h1 className="text-2xl sm:text-3xl font-light mb-2 tracking-wide print:text-xl">
                  ORDEN DE SERVICIO
                </h1>
                <p className="text-lg text-gray-600 font-light print:text-base">
                  #{order.order_number}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 mb-12 print:mb-8" />

              {/* Info Grid - Full */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 mb-12 print:grid-cols-2 print:gap-8 print:mb-8">
                <div>
                  <h3 className="text-base font-medium mb-4 text-black print:text-sm">
                    Información de la Orden
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700 print:text-xs">
                    <p>
                      <span className="font-medium text-black">Fecha:</span>{' '}
                      <DateDisplay value={order.created_at} />
                    </p>
                    <p>
                      <span className="font-medium text-black">Estado:</span>{' '}
                      {order.status}
                    </p>
                    {!!order.customer_id && (
                      <p>
                        <span className="font-medium text-black">Cliente:</span>{' '}
                        {order.customer_id}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-4 text-black print:text-sm">
                    Detalles Financieros
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700 print:text-xs">
                    <p>
                      <span className="font-medium text-black">Subtotal:</span>{' '}
                      {PEN.format(subtotal)}
                    </p>
                    <p>
                      <span className="font-medium text-black">Impuestos:</span>{' '}
                      {PEN.format(tax)}
                    </p>
                    <p>
                      <span className="font-medium text-black">Total:</span>{' '}
                      {PEN.format(total)}
                    </p>
                    <p>
                      <span className="font-medium text-black">Pagado:</span>{' '}
                      {PEN.format(paid)}
                    </p>
                    <p>
                      <span className="font-medium text-black">Balance:</span>{' '}
                      {PEN.format(balance)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table - Full */}
              <div className="mb-12 print:mb-8">
                <table className="w-full border-collapse text-sm print:text-xs">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-2 font-medium text-black print:py-2">
                        Descripción
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-black print:py-2">
                        Cantidad
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-black print:py-2">
                        Precio Unit.
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-black print:py-2">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(order.order_items) &&
                    order.order_items.length > 0 ? (
                      order.order_items.map((it: any, idx: number) => {
                        const qty = it.quantity ?? 0
                        const unit = it.unit_price ?? 0
                        const line = it.total ?? qty * unit
                        return (
                          <tr
                            key={it.id ?? idx}
                            className="border-b border-gray-100"
                          >
                            <td className="py-3 px-2 text-gray-700 print:py-2">
                              {it.description ?? it.name ?? '-'}
                            </td>
                            <td className="py-3 px-2 text-gray-700 print:py-2">
                              {qty}
                            </td>
                            <td className="py-3 px-2 text-gray-700 print:py-2">
                              {PEN.format(unit)}
                            </td>
                            <td className="py-3 px-2 text-gray-700 print:py-2">
                              {PEN.format(line)}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-6 text-gray-500 print:py-4"
                        >
                          Items de la orden (pendiente de implementar)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totales - Full */}
              <div className="ml-auto w-full max-w-xs">
                <div className="space-y-3 text-sm print:text-xs">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-black">{PEN.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Impuestos:</span>
                    <span className="text-black">{PEN.format(tax)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-gray-300 font-medium text-base print:text-sm">
                    <span className="text-black">Total:</span>
                    <span className="text-black">{PEN.format(total)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Pagado:</span>
                    <span className="text-black">{PEN.format(paid)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Balance:</span>
                    <span className="text-black">{PEN.format(balance)}</span>
                  </div>
                </div>
              </div>

              {/* Notas - Full */}
              {!!order.notes && (
                <div className="mt-12 print:mt-8">
                  <h3 className="text-base font-medium mb-4 text-black print:text-sm">
                    Notas:
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed print:text-xs">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

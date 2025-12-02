'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import useOrderDetail from '@/hooks/orders/use-order-detail'
import { DateDisplay } from '../ui/date-picker'
import { Button } from '@/components/ui/button'
import { FileText, Receipt, Printer } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { useTenantDetail } from '@/hooks/tenants/use-tenant-detail'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useCurrency } from '../ui/currency-select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

type OrderPrintProps = {
  orderId: string
  view?: 'full' | 'ticket'
}

export function OrderPrint({
  orderId,
  view: initialView = 'full',
}: OrderPrintProps) {
  const { data: order } = useOrderDetail(orderId)
  const { data: tenant } = useTenantDetail()
  const [currentView, setCurrentView] = useState<'full' | 'ticket'>(initialView)
  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  const { currency } = useCurrency()

  // Configurar react-to-print
  // Configurar react-to-print
  const handlePrintFn = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Orden ${order?.order_number || orderId}`,
    onAfterPrint: () => {
      setIsPrinting(false)
    },
    onPrintError: () => {
      setIsPrinting(false)
    },
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
          color: #000;
        }
        .print-hide { display: none !important; }
        .print-show { display: block !important; }
      }
    `,
  } as any)

  const handlePrint = () => {
    setIsPrinting(true)
    // Small timeout to ensure state update doesn't conflict with print initialization
    setTimeout(() => {
      handlePrintFn()
    }, 100)
  }

  // Actualizar vista cuando cambie el prop
  useEffect(() => {
    setCurrentView(initialView)
  }, [initialView])

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: currency?.value || 'PEN',
        minimumFractionDigits: 2,
      }),
    [currency]
  )

  if (!order) return null

  const tenantName = tenant?.legal_name ?? tenant?.name ?? null
  const tenantEmail = tenant?.email ?? null
  const tenantPhone = tenant?.phone ?? null
  const tenantAddress = (() => {
    const a = tenant?.address as any
    if (!a) return null
    const parts = [a.street, a.city, a.state, a.postal_code].filter(Boolean)
    return parts.length ? parts.join(', ') : null
  })()

  const customer = (order as any).customer
  const customerName =
    [customer?.first_name, customer?.last_name].filter(Boolean).join(' ') ||
    null
  const customerDoc = customer?.doc_id ?? null
  const customerEmail = customer?.email ?? null
  const customerPhone = customer?.phone ?? null
  const customerAddress = customer?.address ?? null

  const subtotal = order.subtotal ?? 0
  const tax = order.tax ?? 0
  const total = order.total ?? subtotal + tax
  const paid = order.paid_amount ?? 0
  const balance = order.balance ?? Math.max(total - paid, 0)

  const computedSubtotal = Array.isArray(order.order_items)
    ? order.order_items.reduce((sum: number, it: any) => {
        const qty = it.quantity ?? 0
        const unit = it.unit_price ?? 0
        const line = it.total ?? qty * unit
        return sum + line
      }, 0)
    : subtotal
  const displaySubtotal = order.subtotal ?? computedSubtotal
  const displayTaxAmount = order.tax_amount ?? 0

  // Clases base comunes
  const baseClasses = 'font-sans text-foreground bg-background w-full'

  // Clases específicas por vista
  const viewClasses = {
    full: 'max-w-4xl mx-auto p-8 sm:p-12 lg:p-16 text-sm leading-relaxed print:p-6 print:text-xs print:max-w-none print:mx-0',
    ticket:
      'max-w-[80mm] mx-auto p-4 text-xs leading-tight bg-white text-black',
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controles de vista e impresión */}
      <div className="flex justify-between items-center mb-4 p-4 bg-muted/50 rounded-lg print-hide shrink-0">
        <Tabs
          value={currentView}
          onValueChange={(v) => setCurrentView(v as 'full' | 'ticket')}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger
              value="full"
              disabled={isPrinting}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Vista Completa
            </TabsTrigger>
            <TabsTrigger
              value="ticket"
              disabled={isPrinting}
              className="flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Vista Ticket
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          onClick={handlePrint}
          size="sm"
          className="flex items-center gap-2"
          disabled={isPrinting}
        >
          <Printer className="h-4 w-4" />
          {isPrinting ? 'Cargando...' : 'Imprimir'}
        </Button>
      </div>

      <ScrollArea className="flex-1 border rounded-md bg-background">
        <div className="p-4 min-h-full flex justify-center">
          {/* Contenido de impresión */}
          <div
            ref={printRef}
            className={cn(baseClasses, viewClasses[currentView])}
          >
            {currentView === 'ticket' ? (
              // TICKET VIEW
              <div className="flex flex-col gap-3">
                <div className="text-center border-b pb-3 border-border">
                  {tenantName && (
                    <h1 className="text-sm font-bold uppercase tracking-wide">
                      {tenantName}
                    </h1>
                  )}
                  {tenantAddress && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {tenantAddress}
                    </p>
                  )}
                  {tenantPhone && (
                    <p className="text-[10px] text-muted-foreground">
                      Tel: {tenantPhone}
                    </p>
                  )}
                  <div className="mt-2 text-[11px]">
                    <p>
                      Orden:{' '}
                      <span className="font-mono font-bold">
                        {order.order_number}
                      </span>
                    </p>
                    <p>
                      <DateDisplay value={order.created_at} />
                    </p>
                  </div>
                </div>

                {/* Info Cliente */}
                {(customerName || customerDoc) && (
                  <div className="text-[11px] space-y-0.5 border-b pb-3 border-border">
                    <p className="font-semibold text-xs">Cliente:</p>
                    <p className="uppercase">
                      {customerName || 'Cliente General'}
                    </p>
                    {customerDoc && <p>DOC: {customerDoc}</p>}
                    {customerAddress && (
                      <p className="truncate">{customerAddress}</p>
                    )}
                  </div>
                )}

                {/* Items */}
                <div className="border-b pb-3 border-border">
                  <div className="grid grid-cols-12 text-[10px] font-bold mb-1 uppercase text-muted-foreground">
                    <div className="col-span-6">Desc</div>
                    <div className="col-span-2 text-center">Cant</div>
                    <div className="col-span-4 text-right">Total</div>
                  </div>
                  <div className="space-y-1.5">
                    {Array.isArray(order.order_items) &&
                    order.order_items.length > 0 ? (
                      order.order_items.map((it: any, idx: number) => {
                        const qty = it.quantity ?? 0
                        const unit = it.unit_price ?? 0
                        const line = it.total ?? qty * unit
                        return (
                          <div key={it.id ?? idx} className="text-[11px]">
                            <div className="font-medium leading-tight mb-0.5">
                              {it.description ?? it.name ?? 'Item sin nombre'}
                            </div>
                            <div className="grid grid-cols-12 text-muted-foreground">
                              <div className="col-span-6"></div>
                              <div className="col-span-2 text-center">
                                {qty}
                              </div>
                              <div className="col-span-4 text-right font-medium text-foreground">
                                {formatCurrency.format(line)}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center text-muted-foreground text-[10px] py-2">
                        - Sin items -
                      </div>
                    )}
                  </div>
                </div>

                {/* Totales */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency.format(displaySubtotal)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impuestos</span>
                      <span>{formatCurrency.format(displayTaxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed border-border mt-1">
                    <span>TOTAL</span>
                    <span>{formatCurrency.format(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground pt-1">
                    <span>Pagado</span>
                    <span>{formatCurrency.format(paid)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Pendiente</span>
                    <span>{formatCurrency.format(balance)}</span>
                  </div>
                </div>

                {/* Pagos */}
                {order.payments && order.payments.length > 0 && (
                  <div className="border-t border-border pt-2 mt-2">
                    <p className="text-[10px] font-bold mb-1 uppercase text-muted-foreground">
                      Pagos
                    </p>
                    {order.payments.map((p: any) => (
                      <div
                        key={p.id}
                        className="flex justify-between text-[10px]"
                      >
                        <span>
                          <DateDisplay value={p.payment_date} />
                        </span>
                        <span>{p.payment_method}</span>
                        <span>{formatCurrency.format(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        JSON.stringify({
                          id: order.id,
                          number: order.order_number,
                        })
                      )}`}
                      alt="QR"
                      className="w-16 h-16 mix-blend-multiply"
                    />
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">
                      ¡Gracias por su preferencia!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // FULL VIEW (A4)
              <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex justify-between items-start border-b pb-6 border-border">
                  <div className="flex gap-4">
                    <div>
                      {tenantName && (
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                          {tenantName}
                        </h1>
                      )}
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        {tenantAddress && <p>{tenantAddress}</p>}
                        {tenantPhone && <p>Tel: {tenantPhone}</p>}
                        {tenantEmail && <p>{tenantEmail}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h2 className="text-3xl font-light text-foreground tracking-tight">
                      ORDEN
                    </h2>
                    <p className="text-lg font-medium text-muted-foreground mt-1">
                      #{order.order_number}
                    </p>
                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground">Fecha de Emisión</p>
                      <p className="font-medium">
                        <DateDisplay value={order.created_at} />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Cliente */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">
                      Facturar a
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="font-semibold text-lg text-foreground">
                        {customerName || 'Cliente General'}
                      </p>
                      {customerDoc && (
                        <p className="text-muted-foreground">
                          ID: {customerDoc}
                        </p>
                      )}
                      {customerAddress && (
                        <p className="text-muted-foreground">
                          {customerAddress}
                        </p>
                      )}
                      {customerPhone && (
                        <p className="text-muted-foreground">{customerPhone}</p>
                      )}
                      {customerEmail && (
                        <p className="text-muted-foreground">{customerEmail}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">
                      Resumen
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estado</span>
                        <span className="font-medium capitalize">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Orden
                        </span>
                        <span className="font-bold">
                          {formatCurrency.format(total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Balance Pendiente
                        </span>
                        <span
                          className={cn(
                            'font-bold',
                            balance > 0 ? 'text-red-600' : 'text-green-600'
                          )}
                        >
                          {formatCurrency.format(balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-foreground/10">
                        <th className="text-left py-3 font-bold text-muted-foreground uppercase text-xs tracking-wider w-[50%]">
                          Descripción
                        </th>
                        <th className="text-center py-3 font-bold text-muted-foreground uppercase text-xs tracking-wider w-[15%]">
                          Cantidad
                        </th>
                        <th className="text-right py-3 font-bold text-muted-foreground uppercase text-xs tracking-wider w-[15%]">
                          Precio Unit.
                        </th>
                        <th className="text-right py-3 font-bold text-muted-foreground uppercase text-xs tracking-wider w-[20%]">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {Array.isArray(order.order_items) &&
                      order.order_items.length > 0 ? (
                        order.order_items.map((it: any, idx: number) => {
                          const qty = it.quantity ?? 0
                          const unit = it.unit_price ?? 0
                          const line = it.total ?? qty * unit
                          return (
                            <tr key={it.id ?? idx}>
                              <td className="py-4 pr-4">
                                <p className="font-medium text-foreground">
                                  {it.description ??
                                    it.name ??
                                    'Item sin nombre'}
                                </p>
                                {it.product?.sku && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    SKU: {it.product.sku}
                                  </p>
                                )}
                              </td>
                              <td className="py-4 text-center text-muted-foreground">
                                {qty}
                              </td>
                              <td className="py-4 text-right text-muted-foreground">
                                {formatCurrency.format(unit)}
                              </td>
                              <td className="py-4 text-right font-medium text-foreground">
                                {formatCurrency.format(line)}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-8 text-muted-foreground italic"
                          >
                            No hay items en esta orden
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Totales y Notas */}
                <div className="grid grid-cols-12 gap-8 mt-4">
                  <div className="col-span-7">
                    {!!order.notes && (
                      <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wider">
                          Notas
                        </h3>
                        <p className="text-sm text-foreground leading-relaxed">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {order.payments && order.payments.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">
                          Historial de Pagos
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                  Fecha
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                                  Método
                                </th>
                                <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                                  Monto
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {order.payments.map((p: any) => (
                                <tr key={p.id}>
                                  <td className="px-3 py-2">
                                    <DateDisplay value={p.payment_date} />
                                  </td>
                                  <td className="px-3 py-2 capitalize">
                                    {p.payment_method}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    {formatCurrency.format(p.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="col-span-5">
                    <div className="bg-muted/10 p-6 rounded-lg border border-border space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          {formatCurrency.format(displaySubtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Impuestos {tax > 0 && `(${tax}%)`}
                        </span>
                        <span className="font-medium">
                          {formatCurrency.format(displayTaxAmount)}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatCurrency.format(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground pt-2">
                        <span>Pagado</span>
                        <span>{formatCurrency.format(paid)}</span>
                      </div>
                      <div className="flex justify-between text-base font-medium pt-1">
                        <span>Balance Pendiente</span>
                        <span
                          className={cn(
                            balance > 0 ? 'text-red-600' : 'text-green-600'
                          )}
                        >
                          {formatCurrency.format(balance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-8 border-t border-border">
                  <div className="flex justify-between items-end">
                    <div className="text-sm text-muted-foreground max-w-md">
                      <p className="font-medium text-foreground mb-1">
                        Términos y Condiciones
                      </p>
                      <p className="text-xs">
                        Gracias por su preferencia. Para cualquier consulta
                        sobre esta orden, por favor contáctenos.
                      </p>
                    </div>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                        JSON.stringify({
                          id: order.id,
                          number: order.order_number,
                        })
                      )}`}
                      alt="QR"
                      className="w-24 h-24 mix-blend-multiply opacity-80"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

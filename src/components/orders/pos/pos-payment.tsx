'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { PosPaymentTable } from '@/components/orders/pos/pos-payment-table'
import { PaymentSummary } from '@/components/orders/pos/payment-summary'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { Separator } from '@/components/ui/separator'
import { PosPaymentMethodSelector } from './pos-payment-method-selector'
import { PosPaymentMethodSelectorButton } from './pos-payment-method-selector-button'

export function POSPayment({}: {}) {
  const { order, payments } = usePOSStore()

  // Calcular valores desde el store
  const cartSubtotal = order?.total || 0
  const cartTax = 0 // Asumiendo que no hay impuestos por ahora
  const cartTotal = cartSubtotal + cartTax
  const totalPaid = order?.paid_amount || 0
  const remainingAmount = order?.balance || 0

  return (
    <div className="flex flex-col h-full">
      {/* Payment Summary - Compact Header */}
      <PaymentSummary
        cartSubtotal={cartSubtotal}
        cartTax={cartTax}
        cartTotal={cartTotal}
        totalPaid={totalPaid}
        remainingAmount={remainingAmount}
        changeAmount={remainingAmount < 0 ? Math.abs(remainingAmount) : 0}
        paymentsCount={payments.length}
      />
      <Separator />
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 h-full">
          {/* Left Column: Payment History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <h3 className="font-medium">Historial de Pagos</h3>
                {remainingAmount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Pendiente: S/ {remainingAmount.toFixed(2)}
                  </Badge>
                )}
              </div>
              <div className="block lg:hidden">
                <PosPaymentMethodSelectorButton />
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <ScrollArea className="h-full overflow-auto">
                <PosPaymentTable />
              </ScrollArea>
            </div>
          </div>

          {/* Right Column: Payment Method Selector (Desktop/Tablet only) */}
          <div className="hidden lg:block">
            <PosPaymentMethodSelector />
          </div>
        </div>
      </div>
    </div>
  )
}

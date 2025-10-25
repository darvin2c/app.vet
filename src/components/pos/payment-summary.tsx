'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Receipt,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

interface PaymentSummaryProps {
  cartSubtotal: number
  cartTax: number
  cartTotal: number
  totalPaid: number
  remainingAmount: number
  changeAmount: number
  paymentsCount: number
}

export function PaymentSummary({
  cartSubtotal,
  cartTax,
  cartTotal,
  totalPaid,
  remainingAmount,
  changeAmount,
  paymentsCount,
}: PaymentSummaryProps) {
  const isPaymentComplete = remainingAmount === 0 && cartTotal > 0
  const isOverpaid = changeAmount > 0
  const isUnderpaid = remainingAmount > 0

  const getPaymentStatus = () => {
    if (isPaymentComplete && !isOverpaid) {
      return {
        icon: CheckCircle,
        label: 'Pago Completo',
        color: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600',
      }
    }
    if (isOverpaid) {
      return {
        icon: DollarSign,
        label: 'Sobrepago',
        color: 'bg-blue-100 text-blue-800',
        iconColor: 'text-blue-600',
      }
    }
    if (isUnderpaid) {
      return {
        icon: Clock,
        label: 'Pago Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        iconColor: 'text-yellow-600',
      }
    }
    return {
      icon: AlertCircle,
      label: 'Sin Pagos',
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-600',
    }
  }

  const status = getPaymentStatus()
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Resumen de Pago
          </div>
          <Badge variant="secondary" className={status.color}>
            <StatusIcon className={`h-3 w-3 mr-1 ${status.iconColor}`} />
            {status.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>S/ {cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Impuestos (18%):</span>
            <span>S/ {cartTax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total a Pagar:</span>
            <span>S/ {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Pagos Agregados:</span>
            <Badge variant="outline">{paymentsCount}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Pagado:</span>
            <span className="font-medium">S/ {totalPaid.toFixed(2)}</span>
          </div>

          {/* Remaining Amount */}
          {remainingAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-yellow-600">Saldo Pendiente:</span>
              <span className="font-medium text-yellow-600">
                S/ {remainingAmount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Change Amount */}
          {changeAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-blue-600">Vuelto:</span>
              <span className="font-medium text-blue-600">
                S/ {changeAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Payment Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso del Pago</span>
            <span>
              {cartTotal > 0
                ? Math.min(100, (totalPaid / cartTotal) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isPaymentComplete
                  ? 'bg-green-500'
                  : isOverpaid
                    ? 'bg-blue-500'
                    : 'bg-yellow-500'
              }`}
              style={{
                width: `${
                  cartTotal > 0
                    ? Math.min(100, (totalPaid / cartTotal) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Status Messages */}
        {isUnderpaid && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                Faltan S/ {remainingAmount.toFixed(2)} para completar el pago
              </span>
            </div>
          </div>
        )}

        {isOverpaid && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">
                Vuelto a entregar: S/ {changeAmount.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {isPaymentComplete && !isOverpaid && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Pago completo. Listo para procesar la orden.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

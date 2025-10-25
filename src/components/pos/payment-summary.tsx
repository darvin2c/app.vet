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
  TrendingUp,
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
        color: 'bg-green-100 text-green-800 border-green-200',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
      }
    }
    if (isOverpaid) {
      return {
        icon: DollarSign,
        label: 'Sobrepago',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
      }
    }
    if (isUnderpaid) {
      return {
        icon: Clock,
        label: 'Pago Pendiente',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      }
    }
    return {
      icon: AlertCircle,
      label: 'Sin Pagos',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
    }
  }

  const status = getPaymentStatus()
  const StatusIcon = status.icon
  const progressPercentage = cartTotal > 0 ? Math.min(100, (totalPaid / cartTotal) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Status Card - Prominente */}
      <Card className={`border-2 ${status.color.includes('border') ? status.color : 'border-gray-200'} ${status.bgColor}`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-6 w-6 md:h-8 md:w-8 ${status.iconColor}`} />
              <div>
                <h3 className="text-lg md:text-xl font-bold">{status.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {paymentsCount} pago{paymentsCount !== 1 ? 's' : ''} agregado{paymentsCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold">
                S/ {cartTotal.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Progress Bar - Más prominente */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progreso del Pago</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
              <div
                className={`h-3 md:h-4 rounded-full transition-all duration-500 ease-out ${
                  isPaymentComplete
                    ? 'bg-green-500'
                    : isOverpaid
                      ? 'bg-blue-500'
                      : 'bg-yellow-500'
                }`}
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* Amounts - Layout responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center md:text-left">
              <div className="text-lg md:text-xl font-bold text-green-600">
                S/ {totalPaid.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Pagado</div>
            </div>
            
            {remainingAmount > 0 && (
              <div className="text-center md:text-left">
                <div className="text-lg md:text-xl font-bold text-yellow-600">
                  S/ {remainingAmount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Pendiente</div>
              </div>
            )}
            
            {changeAmount > 0 && (
              <div className="text-center md:text-left">
                <div className="text-lg md:text-xl font-bold text-blue-600">
                  S/ {changeAmount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Vuelto</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalles - Colapsible en móvil */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-4 w-4" />
            Desglose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Layout compacto para móvil */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>S/ {cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IGV (18%):</span>
              <span>S/ {cartTax.toFixed(2)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>S/ {cartTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Mensajes de Estado - Más prominentes */}
      {isUnderpaid && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-800">
                  Faltan S/ {remainingAmount.toFixed(2)}
                </p>
                <p className="text-sm text-yellow-700">
                  Agregue más pagos para completar la orden
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isOverpaid && (
        <Card className="border-blue-300 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800">
                  Vuelto: S/ {changeAmount.toFixed(2)}
                </p>
                <p className="text-sm text-blue-700">
                  Recuerde entregar el vuelto al cliente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isPaymentComplete && !isOverpaid && (
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">
                  ¡Pago Completo!
                </p>
                <p className="text-sm text-green-700">
                  Listo para procesar la orden
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

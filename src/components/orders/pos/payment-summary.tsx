'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
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
  const isPaymentComplete = remainingAmount === 0 && totalPaid > 0
  const isOverpaid = changeAmount > 0
  const isUnderpaid = remainingAmount > 0

  const getPaymentStatus = () => {
    if (isPaymentComplete && !isOverpaid) {
      return {
        icon: CheckCircle,
        label: 'Completo',
        color: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        progressColor: 'bg-green-500',
      }
    }
    if (isOverpaid) {
      return {
        icon: DollarSign,
        label: 'Sobrepago',
        color: 'bg-blue-100 text-blue-800',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        progressColor: 'bg-blue-500',
      }
    }
    if (isUnderpaid) {
      return {
        icon: Clock,
        label: 'Pendiente',
        color: 'bg-yellow-100 text-yellow-800',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        progressColor: 'bg-yellow-500',
      }
    }
    return {
      icon: AlertCircle,
      label: 'Sin Pagos',
      color: 'bg-gray-100 text-gray-800',
      iconColor: 'text-gray-600',
      bgColor: 'bg-gray-50',
      progressColor: 'bg-gray-400',
    }
  }

  const status = getPaymentStatus()
  const StatusIcon = status.icon
  const progressPercentage =
    cartTotal > 0 ? Math.min(100, (totalPaid / cartTotal) * 100) : 0

  return (
    <div>
      <div className="p-3 md:p-4">
        {/* Mobile Layout - Stack Vertical */}
        <div className="md:hidden space-y-3">
          {/* Primera fila: Total y Estado */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${status.iconColor}`} />
              <div>
                <div className="text-xl font-bold">
                  S/ {cartTotal.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
            <Badge variant="secondary" className={status.color}>
              {status.label}
            </Badge>
          </div>

          {/* Segunda fila: Progreso */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Pagado: S/ {totalPaid.toFixed(2)}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${status.progressColor}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Tercera fila: Montos adicionales */}
          <div className="flex justify-between text-sm">
            {remainingAmount > 0 && (
              <div className="text-yellow-600 font-medium">
                Pendiente: S/ {remainingAmount.toFixed(2)}
              </div>
            )}
            {changeAmount > 0 && (
              <div className="text-blue-600 font-medium">
                Vuelto: S/ {changeAmount.toFixed(2)}
              </div>
            )}
            {paymentsCount > 0 && (
              <div className="text-muted-foreground text-xs">
                {paymentsCount} pago{paymentsCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Izquierda: Estado y Total */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-6 w-6 ${status.iconColor}`} />
              <Badge variant="secondary" className={status.color}>
                {status.label}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <div className="text-2xl font-bold">
                S/ {cartTotal.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total de la orden
              </div>
            </div>
          </div>

          {/* Centro: Progreso */}
          <div className="flex-1 max-w-xs space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${status.progressColor}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Derecha: Montos */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                S/ {totalPaid.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Pagado</div>
            </div>

            {remainingAmount > 0 && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">
                    S/ {remainingAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Pendiente</div>
                </div>
              </>
            )}

            {changeAmount > 0 && (
              <>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    S/ {changeAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Vuelto</div>
                </div>
              </>
            )}

            {/* Tooltip con desglose */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <span>Subtotal:</span>
                      <span>S/ {cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>IGV (18%):</span>
                      <span>S/ {cartTax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between gap-4 font-semibold">
                      <span>Total:</span>
                      <span>S/ {cartTotal.toFixed(2)}</span>
                    </div>
                    {paymentsCount > 0 && (
                      <div className="text-xs text-muted-foreground pt-1">
                        {paymentsCount} pago{paymentsCount !== 1 ? 's' : ''}{' '}
                        agregado{paymentsCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

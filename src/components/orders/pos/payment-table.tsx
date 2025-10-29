'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
  Trash2,
  Receipt,
} from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { toast } from 'sonner'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../ui/empty'
import { CurrencyDisplay } from '@/components/ui/current-input'

const paymentTypeIcons = {
  cash: Banknote,
  app: Smartphone,
  credit: CreditCard,
  others: MoreHorizontal,
}

const paymentTypeLabels = {
  cash: 'Efectivo',
  app: 'App',
  credit: 'Crédito',
  others: 'Otros',
}

export function PaymentTable() {
  const { payments, removePayment, order } = usePOSStore()

  const handleRemovePayment = (paymentId?: string) => {
    if (!paymentId) {
      return
    }
    removePayment(paymentId)
    toast.success('Pago eliminado')
  }

  if (payments.length === 0) {
    return (
      <div className="flex items-center justify-center text-muted-foreground pt-20">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Receipt className="h-28 w-28" />
            </EmptyMedia>
            <EmptyTitle>No hay pagos agregados</EmptyTitle>
            <EmptyDescription>
              Selecciona un método de pago y monto para comenzar a procesar la
              orden
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div>
      <div className="pb-3">
        <div className="text-base flex items-center justify-between p-4">
          <span className="flex items-center gap-2 ">
            <Receipt className="h-4 w-4" />
            Pagos Agregados
          </span>
          <Badge variant="secondary" className="text-xs">
            {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
          </Badge>
        </div>
        <div className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Método</TableHead>
                  <TableHead className="text-right w-[120px]">Monto</TableHead>
                  <TableHead className="w-[200px]">Notas</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => {
                  const Icon =
                    paymentTypeIcons[
                      payment.payment_method
                        ?.payment_type as keyof typeof paymentTypeIcons
                    ] || MoreHorizontal

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {payment.payment_method?.name ||
                                'Método desconocido'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {paymentTypeLabels[
                                payment.payment_method
                                  ?.payment_type as keyof typeof paymentTypeLabels
                              ] || 'Otros'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold">
                          S/ {payment.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {payment.notes || 'Sin notas'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePayment(payment.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 p-4">
            {payments.map((payment, index) => {
              const Icon =
                paymentTypeIcons[
                  payment.payment_method
                    ?.payment_type as keyof typeof paymentTypeIcons
                ] || MoreHorizontal

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {payment.payment_method?.name || 'Método desconocido'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paymentTypeLabels[
                          payment.payment_method
                            ?.payment_type as keyof typeof paymentTypeLabels
                        ] || 'Otros'}
                      </p>
                      {payment.notes && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {payment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        S/ {payment.amount.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePayment(payment.id)}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Footer */}
          <div className="border-t bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Pagado:</span>
              <CurrencyDisplay
                className="text-lg font-bold"
                value={order?.paid_amount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

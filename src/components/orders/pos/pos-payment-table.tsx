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
import { MoreHorizontal, Trash2, Receipt } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../../ui/empty'
import { CurrencyDisplay } from '@/components/ui/currency-input'
import { usePaymentType } from '@/hooks/payment-methods/use-payment-type'
import { Enums } from '@/types/supabase.types'
import { RemoveIcon } from '@/components/icons'

export function PosPaymentTable() {
  const { payments, removePayment, order } = usePOSStore()
  const { getPaymentType } = usePaymentType()

  const savedPayments = order?.payments || []
  const newPayments = payments || []
  console.log('newPayments', newPayments, savedPayments)

  const handleRemovePayment = (index?: number) => {
    if (index === undefined) {
      return
    }
    removePayment(index)
  }

  const renderEmptyPayment = () => (
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

  return (
    <div>
      <div className="pb-3">
        <div className="text-base flex items-center justify-between p-4">
          <span className="flex items-center gap-2 ">
            <Receipt className="h-4 w-4" />
            Pagos Agregados
          </span>
          <Badge variant="secondary" className="text-xs">
            {newPayments.length} {newPayments.length === 1 ? 'pago' : 'pagos'}
          </Badge>
        </div>
        <div className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            {/* New Payments */}
            {newPayments.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium">Pagos por Guardar</span>
                  <Badge variant="outline" className="text-xs">
                    {newPayments.length}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Método</TableHead>
                      <TableHead className="text-right w-[120px]">
                        Monto
                      </TableHead>
                      <TableHead className="w-[200px]">Notas</TableHead>
                      <TableHead className="w-[200px]">Referencia</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newPayments.map((payment, index) => {
                      const paymentType = payment.payment_method?.payment_type
                        ? getPaymentType(
                            payment.payment_method
                              .payment_type as Enums<'payment_type'>
                          )
                        : undefined
                      const Icon = paymentType?.icon || MoreHorizontal

                      return (
                        <TableRow key={`new-${index}`}>
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
                                  {paymentType?.label || 'Otros'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <CurrencyDisplay value={payment.amount} />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {payment.notes || ''}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {payment.reference ? payment.reference : ''}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemovePayment(index)}
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
            )}

            {/* Saved Payments */}
            {savedPayments.length > 0 && (
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium">Pagos Guardados</span>
                  <Badge variant="outline" className="text-xs">
                    {savedPayments.length}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Método</TableHead>
                      <TableHead className="text-right w-[120px]">
                        Monto
                      </TableHead>
                      <TableHead className="w-[200px]">Notas</TableHead>
                      <TableHead className="w-[200px]">Referencia</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedPayments.map((payment, index) => {
                      const paymentType = payment.payment_method?.payment_type
                        ? getPaymentType(
                            payment.payment_method
                              .payment_type as Enums<'payment_type'>
                          )
                        : undefined
                      const Icon = paymentType?.icon || MoreHorizontal

                      return (
                        <TableRow key={`saved-${index}`} className="bg-muted">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm">
                                  {payment.payment_method?.name || ''}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {paymentType?.label || 'Otros'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <CurrencyDisplay value={payment.amount} />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {payment.notes || ''}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {payment.reference ? payment.reference : ''}
                            </span>
                          </TableCell>
                          <TableCell>
                            {/* no delete for saved payments */}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 p-4">
            {/* New Payments */}
            {newPayments.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm font-medium">Pagos por Guardar</span>
                  <Badge variant="outline" className="text-xs">
                    {newPayments.length}
                  </Badge>
                </div>
                {newPayments.map((payment, index) => {
                  const paymentType = payment.payment_method?.payment_type
                    ? getPaymentType(
                        payment.payment_method
                          .payment_type as Enums<'payment_type'>
                      )
                    : undefined
                  const Icon = paymentType?.icon || MoreHorizontal

                  return (
                    <div
                      key={`new-${index}`}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {payment.payment_method?.name ||
                              'Método desconocido'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paymentType?.label || 'Otros'}
                          </p>
                          {payment.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {payment.notes}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {payment.reference
                              ? `Referencia: ${payment.reference}`
                              : ''}
                          </p>
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
                          onClick={() => handleRemovePayment(index)}
                          className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <RemoveIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Saved Payments */}
            {savedPayments.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="text-sm font-medium">Pagos Guardados</span>
                  <Badge variant="outline" className="text-xs">
                    {savedPayments.length}
                  </Badge>
                </div>
                {savedPayments.map((payment, index) => {
                  const paymentType = payment.payment_method?.payment_type
                    ? getPaymentType(
                        payment.payment_method
                          .payment_type as Enums<'payment_type'>
                      )
                    : undefined
                  const Icon = paymentType?.icon || MoreHorizontal

                  return (
                    <div
                      key={`saved-${index}`}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg border"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {payment.payment_method?.name ||
                              'Método desconocido'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {paymentType?.label || 'Otros'}
                          </p>
                          {payment.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {payment.notes}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {payment.reference
                              ? `Referencia: ${payment.reference}`
                              : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            S/ {payment.amount.toFixed(2)}
                          </p>
                        </div>
                        {/* no delete for saved payments */}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
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

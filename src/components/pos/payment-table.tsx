'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  AlertCircle,
} from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { toast } from 'sonner'

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
  const { payments, removePayment, totalPaid } = usePOSStore()

  const handleRemovePayment = (paymentId: string) => {
    removePayment(paymentId)
    toast.success('Pago eliminado')
  }

  if (payments.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No hay pagos agregados
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Selecciona un método de pago y monto para comenzar a procesar la
            orden
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Pagos Agregados
          </span>
          <Badge variant="secondary" className="text-xs">
            {payments.length} {payments.length === 1 ? 'pago' : 'pagos'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
            <span className="text-lg font-bold">S/ {totalPaid.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  MoreHorizontal,
} from 'lucide-react'
import { POSPayment } from '@/hooks/pos/use-pos-store'

interface PaymentTableProps {
  payments: POSPayment[]
  onRemovePayment: (paymentId: string) => void
}

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

export function PaymentTable({ payments, onRemovePayment }: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pagos Agregados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay pagos agregados
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagos Agregados ({payments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const Icon =
                  paymentTypeIcons[
                    payment.payment_method
                      ?.payment_type as keyof typeof paymentTypeIcons
                  ] || MoreHorizontal
                return (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">
                          {payment.payment_method?.name || 'Método desconocido'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {paymentTypeLabels[
                          payment.payment_method
                            ?.payment_type as keyof typeof paymentTypeLabels
                        ] || 'Otros'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      S/ {payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {payment.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemovePayment(payment.id)}
                        className="text-destructive hover:text-destructive"
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
        <div className="md:hidden space-y-3">
          {payments.map((payment) => {
            const Icon =
              paymentTypeIcons[
                payment.payment_method
                  ?.payment_type as keyof typeof paymentTypeIcons
              ] || MoreHorizontal
            return (
              <Card key={payment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">
                        {payment.payment_method?.name || 'Método desconocido'}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {paymentTypeLabels[
                          payment.payment_method
                            ?.payment_type as keyof typeof paymentTypeLabels
                        ] || 'Otros'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="font-mono font-semibold">
                        S/ {payment.amount.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemovePayment(payment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {payment.notes && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {payment.notes}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

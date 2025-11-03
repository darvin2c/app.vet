'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { PaymentForm } from './payment-form'
import {
  CreatePaymentSchema,
  CreatePaymentData,
} from '@/schemas/payments.schema'
import usePaymentCreate from '@/hooks/payments/use-payment-create'
import { ScrollArea } from '../ui/scroll-area'

interface PaymentCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentCreate({
  open,
  onOpenChange,
}: PaymentCreateProps) {
  const createPayment = usePaymentCreate()

  const form = useForm({
    resolver: zodResolver(CreatePaymentSchema),
    defaultValues: {
      amount: 0,
      payment_method_id: '',
      payment_date: new Date().toISOString().split('T')[0],
      customer_id: null,
      order_id: null,
      reference: null,
      notes: null,
    },
  })

  const onSubmit = async (data: CreatePaymentData) => {
    await createPayment.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Crear Pago</SheetTitle>
          <SheetDescription>
            Completa la información para registrar un nuevo pago.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <PaymentForm mode="create" />
            </form>
          </Form>
        </ScrollArea>

        <SheetFooter className="gap-2 flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createPayment.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createPayment.isPending}
          >
            {createPayment.isPending ? 'Creando...' : 'Crear Pago'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
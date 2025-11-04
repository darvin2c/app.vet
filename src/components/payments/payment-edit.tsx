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
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { PaymentForm } from './payment-form'
import {
  UpdatePaymentSchema,
  UpdatePaymentData,
} from '@/schemas/payments.schema'
import usePaymentUpdate from '@/hooks/payments/use-payment-update'
import { Tables } from '@/types/supabase.types'
import { Spinner } from '../ui/spinner'

interface PaymentEditProps {
  payment: Tables<'payments'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentEdit({ payment, open, onOpenChange }: PaymentEditProps) {
  const updatePayment = usePaymentUpdate()

  const form = useForm({
    resolver: zodResolver(UpdatePaymentSchema),
    defaultValues: {
      reference: payment.reference ?? undefined,
      notes: payment.notes ?? undefined,
    },
  })

  const onSubmit = async (data: UpdatePaymentData) => {
    try {
      await updatePayment.mutateAsync({
        id: payment.id,
        data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!w-full !max-w-2xl">
        <SheetHeader>
          <SheetTitle>Editar Pago</SheetTitle>
          <SheetDescription>
            Modifica la información del pago. Solo se pueden editar la
            referencia y las notas.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <PaymentForm mode="update" payment={payment} />
            </form>
          </Form>
        </ScrollArea>

        <SheetFooter className="gap-2 flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updatePayment.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={updatePayment.isPending}
          >
            {updatePayment.isPending ? (
              <>
                <Spinner />
                Actualizando...
              </>
            ) : (
              'Actualizar Pago'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer-form'

import { PaymentMethodForm } from './payment-method-form'
import { usePaymentMethodCreate } from '@/hooks/payment-methods/use-payment-method-create'
import { Form } from '../ui/form'
import { paymentMethodCreateSchema } from '@/schemas/payment-methods.schema'
import CanAccess from '@/components/ui/can-access'

interface PaymentMethodCreateProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function PaymentMethodCreate({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PaymentMethodCreateProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const setOpen = controlledOnOpenChange ?? setInternalOpen
  const mutation = usePaymentMethodCreate()

  const form = useForm({
    resolver: zodResolver(paymentMethodCreateSchema),
    defaultValues: {
      name: '',
      payment_type: 'cash',
      is_active: true,
      ref_required: false,
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync(data)
    form.reset()
    setOpen(false)
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="!max-w-xl">
        <CanAccess resource="products" action="create">
          <DrawerHeader>
            <DrawerTitle>Crear Método de Pago</DrawerTitle>
            <DrawerDescription>
              Completa los datos para crear un nuevo método de pago.
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="px-4">
                <PaymentMethodForm />
              </div>
              <DrawerFooter>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Creando...' : 'Crear Método de Pago'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={mutation.isPending}
                >
                  Cancelar
                </Button>
              </DrawerFooter>
            </form>
          </Form>
        </CanAccess>
      </DrawerContent>
    </Drawer>
  )
}

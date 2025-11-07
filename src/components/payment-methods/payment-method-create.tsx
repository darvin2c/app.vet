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
import {
  PaymentMethodCreateSchema,
  type PaymentMethodCreate,
} from '@/schemas/payment-methods.schema'
import { usePaymentMethodCreate } from '@/hooks/payment-methods/use-payment-method-create'
import { Form } from '../ui/form'

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
    resolver: zodResolver(PaymentMethodCreateSchema),
    defaultValues: {
      name: '',
      payment_type: 'cash' as const,
      is_active: true,
      ref_required: false,
    },
  })

  const onSubmit = async (data: PaymentMethodCreate) => {
    await mutation.mutateAsync(data)
    form.reset({
      name: '',
      payment_type: 'cash' as const,
      is_active: true,
      ref_required: false,
    })
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="!max-w-xl">
        <DrawerHeader>
          <DrawerTitle>Crear Método de Pago</DrawerTitle>
          <DrawerDescription>
            Completa los datos para crear un nuevo método de pago.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="px-4">
              <PaymentMethodForm />
            </div>
            <DrawerFooter>
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={mutation.isPending}
              >
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
      </DrawerContent>
    </Drawer>
  )
}

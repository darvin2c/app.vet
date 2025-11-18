'use client'

import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'

import { PaymentMethodForm } from './payment-method-form'
import {
  PaymentMethodUpdateSchema,
  paymentMethodUpdateSchema,
} from '@/schemas/payment-methods.schema'
import { usePaymentMethodUpdate } from '@/hooks/payment-methods/use-payment-method-update'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface PaymentMethodEditProps {
  paymentMethod: Tables<'payment_methods'>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentMethodEdit({
  paymentMethod,
  open,
  onOpenChange,
}: PaymentMethodEditProps) {
  const mutation = usePaymentMethodUpdate()

  const form = useForm<PaymentMethodUpdateSchema>({
    resolver: zodResolver(paymentMethodUpdateSchema),
    defaultValues: {
      name: paymentMethod.name,
      payment_type: paymentMethod.payment_type,
      is_active: paymentMethod.is_active,
      ref_required: paymentMethod.ref_required,
    },
  })

  useEffect(() => {
    if (paymentMethod) {
      form.reset({
        name: paymentMethod.name,
        payment_type: paymentMethod.payment_type,
        is_active: paymentMethod.is_active,
        ref_required: paymentMethod.ref_required,
      })
    }
  }, [paymentMethod, form])

  const onSubmit = form.handleSubmit(async (data) => {
    await mutation.mutateAsync({
      id: paymentMethod.id,
      data,
    })
    onOpenChange(false)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-xl">
        <CanAccess resource="products" action="update">
          <DrawerHeader>
            <DrawerTitle>Editar Método de Pago</DrawerTitle>
            <DrawerDescription>
              Modifica los datos del método de pago.
            </DrawerDescription>
          </DrawerHeader>
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="px-4 overflow-y-auto">
                <PaymentMethodForm />
              </div>
              <DrawerFooter>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending
                    ? 'Actualizando...'
                    : 'Actualizar Método de Pago'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={mutation.isPending}
                >
                  Cancelar
                </Button>
              </DrawerFooter>
            </form>
          </FormProvider>
        </CanAccess>
      </DrawerContent>
    </Drawer>
  )
}

'use client'

import { useEffect } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomerForm } from './customer-form'
import {
  updateCustomerSchema,
  UpdateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerUpdate from '@/hooks/customers/use-customer-update'
import useCustomerDetail from '@/hooks/customers/use-customer-detail'
import { Field } from '../ui/field'
import CanAccess from '@/components/ui/can-access'

interface CustomerEditProps {
  customerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerEdit({
  customerId,
  open,
  onOpenChange,
}: CustomerEditProps) {
  const updateCustomer = useCustomerUpdate()
  const { data: customer, isLoading } = useCustomerDetail(customerId)

  const form = useForm<UpdateCustomerSchema>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      doc_id: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  })

  // Cargar datos del cliente cuando se obtienen
  useEffect(() => {
    if (customer) {
      form.reset({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        doc_id: customer.doc_id || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        notes: customer.notes || '',
      })
    }
  }, [customer, form])

  const onSubmit = async (data: UpdateCustomerSchema) => {
    await updateCustomer.mutateAsync({
      id: customerId,
      ...data,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <CanAccess resource="products" action="update">
            <SheetHeader>
              <SheetTitle>Editar Cliente</SheetTitle>
              <SheetDescription>
                Modifica la información del cliente.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 min-h-0">
              <div className="px-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit as any)}
                    className="space-y-4"
                  >
                    <CustomerForm mode="edit" />
                  </form>
                </Form>
              </div>
            </div>

            <SheetFooter>
              <Field orientation="horizontal">
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit as any)}
                  disabled={updateCustomer.isPending}
                >
                  {updateCustomer.isPending
                    ? 'Actualizando...'
                    : 'Actualizar Cliente'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={updateCustomer.isPending}
                >
                  Cancelar
                </Button>
              </Field>
            </SheetFooter>
          </CanAccess>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

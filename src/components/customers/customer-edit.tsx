'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateCustomerSchema,
  UpdateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerUpdate from '@/hooks/customers/use-customer-update'
import useCustomerDetail from '@/hooks/customers/use-customer-detail'
import { CustomerForm } from './customer-form'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer-form'
import { Tables } from '@/types/supabase.types'
import { Form } from '../ui/form'
import { Button } from '../ui/button'

type Customer = Tables<'customers'>

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
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!w-full !max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Editar Cliente</DrawerTitle>
          <DrawerDescription>
            Modifica la información del cliente.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CustomerForm mode="edit" />
            </form>
          </Form>
        </div>

        <DrawerFooter>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

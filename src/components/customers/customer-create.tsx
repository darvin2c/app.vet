'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { CustomerForm } from './customer-form'
import {
  createCustomerSchema,
  CreateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerCreate from '@/hooks/customers/use-customer-create'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface CustomerCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerCreated?: (customer: Tables<'customers'>) => void
}

export function CustomerCreate({
  open,
  onOpenChange,
  onCustomerCreated,
}: CustomerCreateProps) {
  const createCustomer = useCustomerCreate()

  const form = useForm<CreateCustomerSchema>({
    resolver: zodResolver(createCustomerSchema),
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

  const onSubmit = async (data: CreateCustomerSchema) => {
    const newCustomer = await createCustomer.mutateAsync(data)
    form.reset()
    onOpenChange(false)
    onCustomerCreated?.(newCustomer)
  }

  return (
    <CanAccess resource="customers" action="create">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Crear Cliente"
        description="Ingresa la información del cliente."
        form={form}
        onSubmit={onSubmit as any}
        isPending={createCustomer.isPending}
        submitLabel="Crear Cliente"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-2xl"
      >
        <CustomerForm mode="create" />
      </FormSheet>
    </CanAccess>
  )
}

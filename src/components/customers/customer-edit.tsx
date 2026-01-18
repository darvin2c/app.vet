'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSheet } from '@/components/ui/form-sheet'
import { CustomerForm } from './customer-form'
import {
  updateCustomerSchema,
  UpdateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerUpdate from '@/hooks/customers/use-customer-update'
import useCustomerDetail from '@/hooks/customers/use-customer-detail'
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
    <CanAccess resource="products" action="update">
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Cliente"
        description="Modifica la información del cliente."
        form={form as any}
        onSubmit={onSubmit as any}
        isPending={updateCustomer.isPending}
        submitLabel="Actualizar Cliente"
        cancelLabel="Cancelar"
        side="right"
        className="!max-w-4xl"
      >
        <CustomerForm mode="edit" />
      </FormSheet>
    </CanAccess>
  )
}

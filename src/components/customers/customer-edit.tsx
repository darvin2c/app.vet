'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateCustomerSchema,
  UpdateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerUpdate from '@/hooks/customers/use-customer-update'
import useCustomerDetail from '@/hooks/customers/use-customer-detail'
import { CustomerForm } from './customer-form'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Save, X } from 'lucide-react'
import { DrawerForm } from '@/components/ui/drawer-form'
import { Tables } from '@/types/supabase.types'

type Customer = Tables<'customers'>

interface CustomerEditProps {
  customerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerEdit({ customerId, open, onOpenChange }: CustomerEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    try {
      setIsSubmitting(true)
      await updateCustomer.mutateAsync({
        id: customerId,
        ...data,
      })
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
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
    onOpenChange(false)
  }

  const footer = (
    <>
      <ResponsiveButton
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        icon={Save}
      >
        Guardar Cambios
      </ResponsiveButton>
      <ResponsiveButton
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
        icon={X}
      >
        Cancelar
      </ResponsiveButton>
    </>
  )

  if (isLoading) {
    return null
  }

  return (
    <DrawerForm
      title="Editar Cliente"
      description="Modifica la información del cliente."
      open={open}
      onOpenChange={onOpenChange}
      footer={footer}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomerForm />
        </form>
      </FormProvider>
    </DrawerForm>
  )
}
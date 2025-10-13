'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createCustomerSchema,
  CreateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerCreate from '@/hooks/customers/use-customer-create'
import { CustomerForm } from './customer-form'
import { Drawer } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, X } from 'lucide-react'

interface CustomerCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerCreate({ open, onOpenChange }: CustomerCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    try {
      setIsSubmitting(true)
      await createCustomer.mutateAsync(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CustomerForm />

          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              icon={Plus}
              className="w-full"
            >
              Crear Cliente
            </ResponsiveButton>

            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              icon={X}
              className="w-full"
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </Drawer>
  )
}
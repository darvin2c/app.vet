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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, X } from 'lucide-react'
import { Form } from '../ui/form'
import { Button } from '../ui/button'

interface CustomerCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerCreate({ open, onOpenChange }: CustomerCreateProps) {
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
    await createCustomer.mutateAsync(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!max-w-4xl">
        <DrawerHeader>
          <DrawerTitle>Crear Cliente</DrawerTitle>
          <DrawerDescription>
            Completa la información para agregar un nuevo cliente.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit as any)}
              className="space-y-4"
            >
              <CustomerForm mode="create" />
            </form>
          </Form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit as any)}
            disabled={createCustomer.isPending}
          >
            {createCustomer.isPending ? 'Creando...' : 'Crear Cliente'}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createCustomer.isPending}
          >
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

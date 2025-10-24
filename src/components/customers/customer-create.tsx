'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomerForm } from './customer-form'
import {
  createCustomerSchema,
  CreateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerCreate from '@/hooks/customers/use-customer-create'
import { Tables } from '@/types/supabase.types'

interface CustomerCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerCreated?: (customer: Tables<'customers'>) => void
}

export function CustomerCreate({ open, onOpenChange, onCustomerCreated }: CustomerCreateProps) {
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

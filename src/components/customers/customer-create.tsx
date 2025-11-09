'use client'

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
  createCustomerSchema,
  CreateCustomerSchema,
} from '@/schemas/customers.schema'
import useCustomerCreate from '@/hooks/customers/use-customer-create'
import { Tables } from '@/types/supabase.types'
import { Field } from '../ui/field'

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`!w-full !max-w-4xl`} side="right">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Crear Cliente</SheetTitle>
            <SheetDescription>
              Ingresa la información del cliente.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 min-h-0">
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
          </div>

          <SheetFooter>
            <Field orientation="horizontal">
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
            </Field>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

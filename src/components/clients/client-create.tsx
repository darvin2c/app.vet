'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createClientSchema,
  CreateClientSchema,
} from '@/schemas/clients.schema'
import useClientCreate from '@/hooks/clients/use-client-create'
import { ClientForm } from './client-form'
import { Drawer } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Plus, X } from 'lucide-react'

interface ClientCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientCreate({ open, onOpenChange }: ClientCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createClient = useClientCreate()

  const form = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      full_name: '',
      document_number: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  })

  const onSubmit = async (data: CreateClientSchema) => {
    try {
      setIsSubmitting(true)
      await createClient.mutateAsync(data)
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
          <ClientForm />

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

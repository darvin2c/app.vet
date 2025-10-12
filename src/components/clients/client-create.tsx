'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClientSchema, CreateClientSchema } from '@/schemas/clients.schema'
import { useCreateClient } from '@/hooks/clients/use-create-client'
import { ClientForm } from './client-form'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Loader2 } from 'lucide-react'

interface ClientCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientCreate({ open, onOpenChange }: ClientCreateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const createClient = useCreateClient()

  const form = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      date_of_birth: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      notes: '',
      is_active: true,
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
    <DrawerForm
      open={open}
      onOpenChange={onOpenChange}
      title="Crear Cliente"
      description="Registra un nuevo cliente en el sistema"
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ClientForm />
          
          <DrawerFooter>
            <ResponsiveButton
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Cliente
            </ResponsiveButton>
            
            <ResponsiveButton
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancelar
            </ResponsiveButton>
          </DrawerFooter>
        </form>
      </FormProvider>
    </DrawerForm>
  )
}
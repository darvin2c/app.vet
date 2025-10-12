'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateClientSchema, UpdateClientSchema } from '@/schemas/clients.schema'
import useClientUpdate from '@/hooks/clients/use-client-update'
import useClientDetail from '@/hooks/clients/use-client-detail'
import { ClientForm } from './client-form'
import { DrawerForm } from '@/components/ui/drawer-form'
import { DrawerFooter } from '@/components/ui/drawer'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { Loader2 } from 'lucide-react'
import { Tables } from '@/types/supabase.types'

type Client = Tables<'clients'>

interface ClientEditProps {
  clientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientEdit({ clientId, open, onOpenChange }: ClientEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const updateClient = useClientUpdate()
  const { data: client, isLoading } = useClientDetail(clientId)

  const form = useForm<UpdateClientSchema>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      full_name: '',
      document_number: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  })

  // Cargar datos del cliente cuando se obtienen
  useEffect(() => {
    if (client) {
      form.reset({
        full_name: client.full_name || '',
        document_number: client.document_number || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        notes: client.notes || '',
      })
    }
  }, [client, form])

  const onSubmit = async (data: UpdateClientSchema) => {
    try {
      setIsSubmitting(true)
      await updateClient.mutateAsync({
        id: clientId,
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
    if (client) {
      form.reset({
        full_name: client.full_name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
        notes: client.notes || '',
      })
    }
    onOpenChange(false)
  }

  if (isLoading) {
    return (
      <DrawerForm
        trigger={<></>}
        open={open}
        onOpenChange={onOpenChange}
        title="Editar Cliente"
        description="Cargando información del cliente..."
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DrawerForm>
    )
  }

  if (!client) {
    return (
      <DrawerForm
        trigger={<></>}
        open={open}
        onOpenChange={onOpenChange}
        title="Cliente no encontrado"
        description="No se pudo cargar la información del cliente"
      >
        <div className="py-8 text-center text-muted-foreground">
          Cliente no encontrado
        </div>
        <DrawerFooter>
          <ResponsiveButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cerrar
          </ResponsiveButton>
        </DrawerFooter>
      </DrawerForm>
    )
  }

  return (
    <DrawerForm
      trigger={<></>}
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Cliente"
      description={`Modificar información de ${client.full_name}`}
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
              Actualizar Cliente
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
'use client'

import { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  updateClientSchema,
  UpdateClientSchema,
} from '@/schemas/clients.schema'
import useClientUpdate from '@/hooks/clients/use-client-update'
import useClientDetail from '@/hooks/clients/use-client-detail'
import { ClientForm } from './client-form'
import { Drawer } from '@/components/ui/drawer-form'
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

  return <Drawer open={open} onOpenChange={onOpenChange}></Drawer>
}

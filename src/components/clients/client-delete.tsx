'use client'

import { useState } from 'react'
import { useDeleteClient } from '@/hooks/clients/use-delete-client'
import { AlertConfirmation } from '@/components/ui/alert-confirmation'
import { Tables } from '@/types/supabase.types'

type Client = Tables<'clients'>

interface ClientDeleteProps {
  client: Client
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDelete({ client, open, onOpenChange }: ClientDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteClient = useDeleteClient()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteClient.mutateAsync(client.id)
      onOpenChange(false)
    } catch (error) {
      // Error ya manejado en el hook
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmationWord = `${client.first_name} ${client.last_name}`.toLowerCase()

  return (
    <AlertConfirmation
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar Cliente"
      description={
        <>
          Esta acción eliminará permanentemente al cliente{' '}
          <strong>{client.first_name} {client.last_name}</strong> y todos sus datos asociados.
          <br />
          <br />
          Para confirmar, escribe: <strong>{confirmationWord}</strong>
        </>
      }
      confirmationWord={confirmationWord}
      onConfirm={handleDelete}
      isLoading={isDeleting}
      variant="destructive"
    />
  )
}
'use client'

import { useState } from 'react'
import useClientDelete from '@/hooks/clients/use-client-delete'
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
  const deleteClient = useClientDelete()

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

  const confirmationWord = client.full_name.toLowerCase()

  return (
    <AlertConfirmation
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Eliminar Cliente"
      description={`Esta acción eliminará permanentemente al cliente ${client.full_name} y todos sus datos asociados.`}
      confirmText={confirmationWord}
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  )
}
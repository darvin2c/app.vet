'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClientEdit } from './client-edit'
import { ClientDelete } from './client-delete'
import { Tables } from '@/types/supabase.types'

type Client = Tables<'clients'>

interface ClientActionsProps {
  client: Client
  onView?: (client: Client) => void
}

export function ClientActions({ client, onView }: ClientActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleCall = () => {
    if (client.phone) {
      window.open(`tel:${client.phone}`, '_self')
    }
  }

  const handleEmail = () => {
    if (client.email) {
      window.open(`mailto:${client.email}`, '_self')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onView && (
            <>
              <DropdownMenuItem onClick={() => onView(client)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          {client.phone && (
            <DropdownMenuItem onClick={handleCall}>
              <Phone className="mr-2 h-4 w-4" />
              Llamar
            </DropdownMenuItem>
          )}

          {client.email && (
            <DropdownMenuItem onClick={handleEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar email
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDelete(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClientEdit
        clientId={client.id}
        open={showEdit}
        onOpenChange={setShowEdit}
      />

      <ClientDelete
        client={client}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  )
}

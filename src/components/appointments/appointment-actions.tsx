'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppointmentEdit } from './appointment-edit'
import { AppointmentDelete } from './appointment-delete'
import type { Tables } from '@/types/supabase.types'

type Appointment = Tables<'appointments'> & {
  pets:
    | (Tables<'pets'> & {
        customers: Tables<'customers'> | null
      })
    | null
  staff: Tables<'staff'> | null
  appointment_types: Tables<'appointment_types'> | null
}

interface AppointmentActionsProps {
  appointment: Appointment
  onEdit?: (appointment: Appointment) => void
  onDelete?: (appointment: Appointment) => void
}

export function AppointmentActions({
  appointment,
  onEdit,
  onDelete,
}: AppointmentActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppointmentEdit
        appointment={appointment}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => onEdit?.(appointment)}
      />

      <AppointmentDelete
        appointment={appointment}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={() => onDelete?.(appointment)}
      />
    </>
  )
}

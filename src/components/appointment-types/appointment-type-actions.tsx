'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { AppointmentTypeEdit } from './appointment-type-edit'
import { AppointmentTypeDelete } from './appointment-type-delete'
import type { Tables } from '@/types/supabase.types'

type AppointmentType = Tables<'appointment_types'>

interface AppointmentTypeActionsProps {
  appointmentType: AppointmentType
  onEdit?: () => void
  onDelete?: () => void
}

export function AppointmentTypeActions({
  appointmentType,
  onEdit,
  onDelete,
}: AppointmentTypeActionsProps) {
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

      <AppointmentTypeEdit
        appointmentType={appointmentType}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onEdit}
      />

      <AppointmentTypeDelete
        appointmentType={appointmentType}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={onDelete}
      />
    </>
  )
}

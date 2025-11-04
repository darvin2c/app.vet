'use client'

import { useState } from 'react'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppointmentTypeEdit } from './appointment-type-edit'
import { AppointmentTypeDelete } from './appointment-type-delete'
import type { AppointmentType } from '@/types/supabase.types'

interface AppointmentTypeActionsProps {
  appointmentType: AppointmentType
  onSuccess?: () => void
}

export function AppointmentTypeActions({
  appointmentType,
  onSuccess,
}: AppointmentTypeActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AppointmentTypeEdit
        appointmentType={appointmentType}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onSuccess}
      />

      <AppointmentTypeDelete
        appointmentType={appointmentType}
        onSuccess={onSuccess}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

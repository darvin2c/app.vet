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
import { SurgeryEdit } from './surgery-edit'
import { SurgeryDelete } from './surgery-delete'
import type { Tables } from '@/types/supabase.types'

interface SurgeryActionsProps {
  surgery: Tables<'surgeries'>
  onEdit?: (surgery: Tables<'surgeries'>) => void
  onDelete?: (surgery: Tables<'surgeries'>) => void
}

export function SurgeryActions({
  surgery,
  onEdit,
  onDelete,
}: SurgeryActionsProps) {
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

      <SurgeryEdit
        surgery={surgery}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <SurgeryDelete
        surgery={surgery}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

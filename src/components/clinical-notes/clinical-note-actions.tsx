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
import { ClinicalNoteEdit } from './clinical-note-edit'
import { ClinicalNoteDelete } from './clinical-note-delete'
import type { Tables } from '@/types/supabase.types'

interface ClinicalNoteActionsProps {
  clinicalNote: Tables<'clinical_notes'>
  onEdit?: (clinicalNote: Tables<'clinical_notes'>) => void
  onDelete?: (clinicalNote: Tables<'clinical_notes'>) => void
}

export function ClinicalNoteActions({
  clinicalNote,
  onEdit,
  onDelete,
}: ClinicalNoteActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleEdit = () => {
    setEditOpen(true)
    if (onEdit) {
      onEdit(clinicalNote)
    }
  }

  const handleDelete = () => {
    setDeleteOpen(true)
    if (onDelete) {
      onDelete(clinicalNote)
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
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClinicalNoteEdit
        clinicalNote={clinicalNote}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ClinicalNoteDelete
        clinicalNote={clinicalNote}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

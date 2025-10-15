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
import { ClinicalParameterEdit } from './clinical-parameter-edit'
import { ClinicalParameterDelete } from './clinical-parameter-delete'
import type { Tables } from '@/types/supabase.types'

interface ClinicalParameterActionsProps {
  clinicalParameter: Tables<'clinical_parameters'>
  onEdit?: (clinicalParameter: Tables<'clinical_parameters'>) => void
  onDelete?: (clinicalParameter: Tables<'clinical_parameters'>) => void
}

export function ClinicalParameterActions({
  clinicalParameter,
  onEdit,
  onDelete,
}: ClinicalParameterActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleEdit = () => {
    setEditOpen(true)
    if (onEdit) {
      onEdit(clinicalParameter)
    }
  }

  const handleDelete = () => {
    setDeleteOpen(true)
    if (onDelete) {
      onDelete(clinicalParameter)
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
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClinicalParameterEdit
        clinicalParameter={clinicalParameter}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ClinicalParameterDelete
        clinicalParameterId={clinicalParameter.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          // Handle delete confirmation
          setDeleteOpen(false)
        }}
      />
    </>
  )
}

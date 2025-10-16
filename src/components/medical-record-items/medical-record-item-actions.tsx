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
import { MedicalRecordItemEdit } from './medical-record-item-edit'
import { MedicalRecordItemDelete } from './medical-record-item-delete'
import type { Tables } from '@/types/supabase.types'

interface MedicalRecordItemActionsProps {
  medicalRecordItem: Tables<'record_items'>
  onEdit?: (medicalRecordItem: Tables<'record_items'>) => void
  onDelete?: (medicalRecordItem: Tables<'record_items'>) => void
}

export function MedicalRecordItemActions({
  medicalRecordItem,
  onEdit,
  onDelete,
}: MedicalRecordItemActionsProps) {
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

      <MedicalRecordItemEdit
        medicalRecordItem={medicalRecordItem}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <MedicalRecordItemDelete
        medicalRecordItem={medicalRecordItem}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

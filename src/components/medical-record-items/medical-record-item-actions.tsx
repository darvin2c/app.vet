'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { MedicalRecordItemEdit } from './medical-record-item-edit'
import { MedicalRecordItemDelete } from './medical-record-item-delete'

interface MedicalRecordItemActionsProps {
  medicalRecordItem: Tables<'record_items'>
}

export function MedicalRecordItemActions({
  medicalRecordItem,
}: MedicalRecordItemActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
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

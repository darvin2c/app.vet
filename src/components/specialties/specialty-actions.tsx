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
import { SpecialtyEdit } from './specialty-edit'
import { SpecialtyDelete } from './specialty-delete'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

interface SpecialtyActionsProps {
  specialty: Tables<'specialties'>
}

export function SpecialtyActions({ specialty }: SpecialtyActionsProps) {
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
          <CanAccess resource="specialties" action="update">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess resource="specialties" action="delete">
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <SpecialtyEdit
        specialty={specialty}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <SpecialtyDelete
        specialty={specialty}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

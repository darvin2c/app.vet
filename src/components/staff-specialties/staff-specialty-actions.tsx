'use client'

import { useState } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StaffSpecialtyDelete } from './staff-specialty-delete'
import { Tables } from '@/types/supabase.types'

interface StaffSpecialtyActionsProps {
  staffSpecialty: Tables<'staff_specialties'> & {
    staff?: { full_name: string } | null
    specialties?: { name: string } | null
  }
}

export function StaffSpecialtyActions({
  staffSpecialty,
}: StaffSpecialtyActionsProps) {
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
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Desasignar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StaffSpecialtyDelete
        staffSpecialty={staffSpecialty}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

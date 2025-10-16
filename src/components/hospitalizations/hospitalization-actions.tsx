import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HospitalizationEdit } from './hospitalization-edit'
import { HospitalizationDelete } from './hospitalization-delete'
import { Tables } from '@/types/supabase.types'

// Tipo para hospitalization (sin pet_id por ahora, se agregará después)
type Hospitalization = Tables<'hospitalizations'>

interface HospitalizationActionsProps {
  hospitalization: Hospitalization
}

export function HospitalizationActions({
  hospitalization,
}: HospitalizationActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
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

      <HospitalizationEdit
        hospitalization={hospitalization}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <HospitalizationDelete
        hospitalizationId={hospitalization.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => setDeleteOpen(false)}
      />
    </>
  )
}

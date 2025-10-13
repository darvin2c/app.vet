'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { SpeciesEdit } from './species-edit'
import { SpeciesDelete } from './species-delete'
import { BreedCreate } from '../breeds/breed-create'

interface SpeciesActionsProps {
  species: Tables<'species'>
}

export function SpeciesActions({ species }: SpeciesActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBreedCreateDialog, setShowBreedCreateDialog] = useState(false)

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
          <DropdownMenuItem onClick={() => setShowBreedCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Raza
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SpeciesEdit
        species={species}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <SpeciesDelete
        species={species}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />

      <BreedCreate
        open={showBreedCreateDialog}
        onOpenChange={setShowBreedCreateDialog}
        selectedSpeciesId={species.id}
      />
    </>
  )
}

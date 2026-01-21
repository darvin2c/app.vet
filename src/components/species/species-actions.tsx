'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, Plus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { SpeciesEdit } from './species-edit'
import { SpeciesDelete } from './species-delete'
import { BreedCreate } from '../breeds/breed-create'
import { BreedImport } from '../breeds/breed-import'
import CanAccess from '@/components/ui/can-access'

interface SpeciesActionsProps {
  species: Tables<'species'>
}

export function SpeciesActions({ species }: SpeciesActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showBreedCreateDialog, setShowBreedCreateDialog] = useState(false)
  const [showBreedImportDialog, setShowBreedImportDialog] = useState(false)

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
          <CanAccess resource="species" action="update">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess resource="species" action="delete">
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
          <DropdownMenuSeparator />
          <CanAccess resource="species" action="update">
            <DropdownMenuItem onClick={() => setShowBreedCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Raza
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowBreedImportDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Importar Razas
            </DropdownMenuItem>
          </CanAccess>
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

      <BreedImport
        open={showBreedImportDialog}
        onOpenChange={setShowBreedImportDialog}
        selectedSpeciesId={species.id}
      />
    </>
  )
}

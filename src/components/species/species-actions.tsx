'use client'

import { SpeciesEdit } from './species-edit'
import { SpeciesDelete } from './species-delete'
import { Tables } from '@/types/supabase.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'

interface SpeciesActionsProps {
  species: Tables<'species'>
}

export function SpeciesActions({ species }: SpeciesActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ResponsiveButton
          variant="ghost"
          size="sm"
          icon={MoreHorizontal}
          tooltip="Acciones"
        >
          Acciones
        </ResponsiveButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <SpeciesEdit
            species={species}
            trigger={
              <div className="flex items-center gap-2 w-full">
                <Edit className="h-4 w-4" />
                Editar
              </div>
            }
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <SpeciesDelete
            species={species}
            trigger={
              <div className="flex items-center gap-2 w-full text-destructive">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </div>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

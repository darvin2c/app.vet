'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { usePetCreateBulk } from '@/hooks/pets/use-pet-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { CreatePetSchema, createPetSchema } from '@/schemas/pets.schema'

interface PetImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetImport({ open, onOpenChange }: PetImportProps) {
  const createPetBulk = usePetCreateBulk()

  const handleImport = async (data: CreatePetSchema[]) => {
    try {
      await createPetBulk.mutateAsync(data)
      toast.success('Mascotas importadas exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error importing pets:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Importar Mascotas</SheetTitle>
          <SheetDescription>
            Sube un archivo CSV o Excel con los datos de las mascotas para
            importarlas masivamente.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-6">
          <DataImport
            schema={createPetSchema}
            onImport={handleImport}
            isLoading={createPetBulk.isPending}
            templateName="mascotas_template.csv"
            title="Importar Mascotas"
            description="Importa mascotas desde un archivo CSV o Excel. Los campos requeridos son: name, species_id, client_id, sex."
            error={createPetBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

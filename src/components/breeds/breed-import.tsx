'use client'

import { useState } from 'react'
import { z } from 'zod'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataImport } from '@/components/ui/data-import'
import { useBreedCreateBulk } from '@/hooks/breeds/use-breed-create-bulk'
import { breedImportSchema } from '@/schemas/breeds.schema'
import { SpeciesSelect } from '@/components/species/species-select'
import { toast } from 'sonner'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '../ui/field'

interface BreedImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSpeciesId?: string
}

export function BreedImport({
  open,
  onOpenChange,
  selectedSpeciesId,
}: BreedImportProps) {
  const createBreedsBulk = useBreedCreateBulk()
  const [speciesId, setSpeciesId] = useState<string>(selectedSpeciesId ?? '')

  // El archivo de importación no incluye species_id; lo requerimos vía UI
  const importSchema = breedImportSchema

  const handleImport = async (data: z.infer<typeof importSchema>[]) => {
    if (!speciesId) {
      toast.error('Selecciona una especie para importar las razas')
      return
    }
    await createBreedsBulk.mutateAsync(
      data.map((item) => ({
        ...item,
        species_id: speciesId,
      }))
    )
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Importar Razas</SheetTitle>
            <SheetDescription>
              Importa razas desde un archivo CSV o Excel.
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="px-6">
            <FieldSeparator />
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel>Especie</FieldLabel>
                <FieldDescription>
                  Selecciona la especie a la que pertenecen las razas
                  importadas.
                </FieldDescription>
              </FieldContent>
              <div className="max-w-md w-full">
                <SpeciesSelect
                  value={speciesId}
                  onValueChange={setSpeciesId}
                  placeholder="Selecciona una especie..."
                />
              </div>
            </Field>
            <FieldSeparator />
            <DataImport
              schema={importSchema}
              onImport={handleImport}
              isLoading={createBreedsBulk.isPending}
              templateName="razas_template.csv"
              title="Importar Razas"
              description="Importa razas desde un archivo CSV o Excel. Campos requeridos: name. Opcionales: description, is_active."
              error={createBreedsBulk.error?.message || null}
            />
          </FieldGroup>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

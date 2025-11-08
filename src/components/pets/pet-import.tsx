'use client'

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
import { CreatePetSchema, petImportSchema } from '@/schemas/pets.schema'

interface PetImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PetImport({ open, onOpenChange }: PetImportProps) {
  const createPetBulk = usePetCreateBulk()

  const handleImport = async (data: CreatePetSchema[]) => {
    await createPetBulk.mutateAsync(data)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Importar Mascotas</SheetTitle>
            <SheetDescription>
              Sube un archivo CSV o Excel con los datos de las mascotas para
              importarlas masivamente.
            </SheetDescription>
          </SheetHeader>
          <DataImport
            schema={petImportSchema}
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

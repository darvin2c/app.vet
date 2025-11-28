'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSpeciesCreateBulk } from '@/hooks/species/use-species-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import { SpeciesCreate, speciesImportSchema } from '@/schemas/species.schema'
import { ScrollArea } from '../ui/scroll-area'

interface SpeciesImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpeciesImport({ open, onOpenChange }: SpeciesImportProps) {
  const createSpeciesBulk = useSpeciesCreateBulk()

  const handleImport = async (data: SpeciesCreate[]) => {
    await createSpeciesBulk.mutateAsync(data)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Importar Especies</SheetTitle>
            <SheetDescription>
              Importa especies desde un archivo CSV o Excel.
            </SheetDescription>
          </SheetHeader>
          <DataImport
            schema={speciesImportSchema}
            onImport={handleImport}
            isLoading={createSpeciesBulk.isPending}
            templateName="especies_template.csv"
            title="Importar Especies"
            description="Importa especies desde un archivo CSV o Excel. Los campos requeridos son: name. Los campos opcionales son: description, is_active."
            error={createSpeciesBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

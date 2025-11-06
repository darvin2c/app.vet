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
import { toast } from 'sonner'
import { SpeciesCreate, speciesImportSchema } from '@/schemas/species.schema'
import { ScrollArea } from '../ui/scroll-area'

interface SpeciesImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpeciesImport({ open, onOpenChange }: SpeciesImportProps) {
  const createSpeciesBulk = useSpeciesCreateBulk()

  const handleImport = async (data: SpeciesCreate[]) => {
    try {
      await createSpeciesBulk.mutateAsync(data)
      toast.success('Especies importadas exitosamente')
      onOpenChange(false)
    } catch (error) {
      // El error se manejará a través de la prop error del DataImport
      console.error('Error al importar especies:', error)
    }
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

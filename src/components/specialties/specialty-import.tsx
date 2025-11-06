'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  SpecialtyCreate,
  useSpecialtyCreateBulk,
} from '@/hooks/specialties/use-specialty-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { specialtyImportSchema } from '@/schemas/specialties.schema'

interface SpecialtyImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyImport({ open, onOpenChange }: SpecialtyImportProps) {
  const createSpecialtyBulk = useSpecialtyCreateBulk()

  const handleImport = async (data: SpecialtyCreate[]) => {
    await createSpecialtyBulk.mutateAsync(data)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Especialidades</SheetTitle>
          <SheetDescription>
            Importa especialidades desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="max-h-[calc(100vh-100px)] pb-10">
          <DataImport
            schema={specialtyImportSchema}
            onImport={handleImport}
            isLoading={createSpecialtyBulk.isPending}
            templateName="especialidades_template.csv"
            title="Importar Especialidades"
            description="Importa especialidades desde un archivo CSV o Excel. Los campos requeridos son: name. Los campos opcionales son: description, is_active."
            error={createSpecialtyBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

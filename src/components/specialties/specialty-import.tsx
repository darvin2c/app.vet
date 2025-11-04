'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSpecialtyCreateBulk } from '@/hooks/specialties/use-specialty-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  CreateSpecialtySchema,
  createSpecialtySchema,
  SpecialtyCreate,
} from '@/schemas/specialties.schema'

interface SpecialtyImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SpecialtyImport({ open, onOpenChange }: SpecialtyImportProps) {
  const createSpecialtyBulk = useSpecialtyCreateBulk()

  const handleImport = async (data: SpecialtyCreate[]) => {
    try {
      // Generar código automáticamente si no se proporciona
      const dataWithCode = data.map((item) => ({
        ...item,
      }))

      await createSpecialtyBulk.mutateAsync(dataWithCode)
      toast.success('Especialidades importadas exitosamente')
      onOpenChange(false)
    } catch (error) {
      // El error se manejará a través de la prop error del DataImport
      console.error('Error al importar especialidades:', error)
    }
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

        <DataImport
          schema={createSpecialtySchema}
          onImport={handleImport}
          isLoading={createSpecialtyBulk.isPending}
          templateName="especialidades_template.csv"
          title="Importar Especialidades"
          description="Importa especialidades desde un archivo CSV o Excel. Los campos requeridos son: name. Los campos opcionales son: description, is_active."
          error={createSpecialtyBulk.error?.message || null}
        />
      </SheetContent>
    </Sheet>
  )
}

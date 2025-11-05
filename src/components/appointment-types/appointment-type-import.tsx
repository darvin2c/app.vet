'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAppointmentTypeCreateBulk } from '@/hooks/appointment-types/use-appointment-type-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import {
  createAppointmentTypeSchema,
  type CreateAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AppointmentTypeImportProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AppointmentTypeImport({
  open,
  onOpenChange,
}: AppointmentTypeImportProps) {
  const createBulkMutation = useAppointmentTypeCreateBulk()

  const handleImport = async (data: CreateAppointmentTypeSchema[]) => {
    try {
      await createBulkMutation.mutateAsync(data)
      onOpenChange?.(false)
    } catch (error) {
      // El error se manejará a través de la prop error del DataImport
      console.error('Error al importar tipos de cita:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Tipos de Cita</SheetTitle>
          <SheetDescription>
            Importa tipos de cita desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <DataImport
            schema={createAppointmentTypeSchema}
            onImport={handleImport}
            isLoading={createBulkMutation.isPending}
            templateName="tipos_de_cita_template.csv"
            title="Importar Tipos de Cita"
            description="Importa tipos de cita desde un archivo CSV o Excel. Los campos requeridos son: name, duration_minutes, color. Los campos opcionales son: code, description, is_active."
            error={createBulkMutation.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

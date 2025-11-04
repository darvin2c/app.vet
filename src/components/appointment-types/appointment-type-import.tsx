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
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  CreateAppointmentTypeSchema,
  createAppointmentTypeSchema,
} from '@/schemas/appointment-types.schema'

interface AppointmentTypeImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppointmentTypeImport({
  open,
  onOpenChange,
}: AppointmentTypeImportProps) {
  const createAppointmentTypeBulk = useAppointmentTypeCreateBulk()

  const handleImport = async (data: CreateAppointmentTypeSchema[]) => {
    try {
      await createAppointmentTypeBulk.mutateAsync(data)
      toast.success('Tipos de cita importados exitosamente')
      onOpenChange(false)
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

        <ScrollArea className="mt-6">
          <DataImport
            schema={createAppointmentTypeSchema}
            onImport={handleImport}
            isLoading={createAppointmentTypeBulk.isPending}
            templateName="tipos_cita_template.csv"
            title="Importar Tipos de Cita"
            description="Importa tipos de cita desde un archivo CSV o Excel. Los campos requeridos son: name, duration_minutes. Los campos opcionales son: description, color, is_active."
            error={createAppointmentTypeBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

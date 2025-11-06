'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useStaffCreateBulk } from '@/hooks/staff/use-staff-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StaffCreateSchema, staffImportSchema } from '@/schemas/staff.schema'

interface StaffImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StaffImport({ open, onOpenChange }: StaffImportProps) {
  const createStaffBulk = useStaffCreateBulk()

  const handleImport = async (data: StaffCreateSchema[]) => {
    await createStaffBulk.mutateAsync(data)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Personal</SheetTitle>
          <SheetDescription>
            Importa personal desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={staffImportSchema}
            onImport={handleImport}
            isLoading={createStaffBulk.isPending}
            templateName="personal_template.csv"
            title="Importar Personal"
            description="Importa personal desde un archivo CSV o Excel. Los campos requeridos son: first_name, last_name, email, phone. Los campos opcionales son: date_of_birth, hire_date, position, is_active."
            error={createStaffBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

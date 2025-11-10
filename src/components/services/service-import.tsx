'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useProductCreateBulk } from '@/hooks/products/use-product-create'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ServiceCreateSchema,
  serviceImportSchema,
} from '@/schemas/services.schema'

interface ServiceImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceImport({ open, onOpenChange }: ServiceImportProps) {
  const createServiceBulk = useProductCreateBulk()

  const handleImport = async (data: ServiceCreateSchema[]) => {
    const formattedData = data.map((item) => ({
      ...item,
      is_service: true,
    }))
    await createServiceBulk.mutateAsync(formattedData)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Productos</SheetTitle>
          <SheetDescription>
            Importa productos desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={serviceImportSchema}
            onImport={handleImport}
            isLoading={createServiceBulk.isPending}
            templateName="servicios_template.csv"
            title="Importar Servicios"
            description="Importa servicios desde un archivo CSV o Excel. Los campos requeridos son: name, price."
            error={createServiceBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

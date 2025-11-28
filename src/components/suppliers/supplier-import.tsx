'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSupplierCreateBulk } from '@/hooks/suppliers/use-supplier-create-bulk'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  CreateSupplierSchema,
  createSupplierSchema,
} from '@/schemas/suppliers.schema'

interface SupplierImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierImport({ open, onOpenChange }: SupplierImportProps) {
  const createSupplierBulk = useSupplierCreateBulk()

  const handleImport = async (data: CreateSupplierSchema[]) => {
    try {
      await createSupplierBulk.mutateAsync(data)
      toast.success('Proveedores importados exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error importing suppliers:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Importar Proveedores</SheetTitle>
          <SheetDescription>
            Sube un archivo CSV o Excel con los datos de los proveedores para
            importarlos masivamente.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-6">
          <DataImport
            schema={createSupplierSchema}
            onImport={handleImport}
            isLoading={createSupplierBulk.isPending}
            templateName="proveedores_template.csv"
            title="Importar Proveedores"
            description="Importa proveedores desde un archivo CSV o Excel. El campo requerido es: name. Los campos opcionales son: contact_person, email, phone, address, document_number, website, notes."
            error={createSupplierBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

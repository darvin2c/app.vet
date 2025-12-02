'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCustomerCreateBulk } from '@/hooks/customers/use-customer-create'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  CreateCustomerSchema,
  createCustomerSchema,
} from '@/schemas/customers.schema'

interface CustomerImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerImport({ open, onOpenChange }: CustomerImportProps) {
  const createCustomerBulk = useCustomerCreateBulk()

  const handleImport = async (data: CreateCustomerSchema[]) => {
    try {
      await createCustomerBulk.mutateAsync(data)
      toast.success('Clientes importados exitosamente')
      onOpenChange(false)
    } catch (error) {
      // El error se manejará a través de la prop error del DataImport
      console.error('Error al importar clientes:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Clientes</SheetTitle>
          <SheetDescription>
            Importa clientes desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={createCustomerSchema}
            onImport={handleImport}
            isLoading={createCustomerBulk.isPending}
            templateName="clientes_template.csv"
            title="Importar Clientes"
            description="Importa clientes desde un archivo CSV o Excel. Los campos requeridos son: first_name, last_name, doc_id."
            error={createCustomerBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

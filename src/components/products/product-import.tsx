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
import { toast } from 'sonner'
import {
  ProductCreateSchema,
  productImportSchema,
} from '@/schemas/products.schema'

interface ProductImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductImport({ open, onOpenChange }: ProductImportProps) {
  const createProductBulk = useProductCreateBulk()

  const handleImport = async (data: ProductCreateSchema[]) => {
    try {
      const formattedData = data.map((item) => ({
        ...item,
        expiry_date: item.expiry_date
          ? item.expiry_date.toISOString()
          : undefined,
      }))
      await createProductBulk.mutateAsync(formattedData)
      toast.success('Productos importados exitosamente')
      onOpenChange(false)
    } catch (error) {
      // El error se manejará a través de la prop error del DataImport
      console.error('Error al importar productos:', error)
    }
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
            schema={productImportSchema}
            onImport={handleImport}
            isLoading={createProductBulk.isPending}
            templateName="productos_template.csv"
            title="Importar Productos"
            description="Importa productos desde un archivo CSV o Excel. Los campos requeridos son: name, price, stock."
            error={createProductBulk.error?.message || null}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

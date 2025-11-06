'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataImport } from '@/components/ui/data-import'
import { useProductBrandCreateBulk } from '@/hooks/product-brands/use-product-brand-create-bulk'
import {
  ProductBrandCreateSchema,
  productBrandImportSchema,
} from '@/schemas/product-brands.schema'

interface ProductBrandImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandImport({
  open,
  onOpenChange,
}: ProductBrandImportProps) {
  const createProductBrandBulk = useProductBrandCreateBulk()

  const handleImport = async (data: ProductBrandCreateSchema[]) => {
    await createProductBrandBulk.mutateAsync(data)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Importar Marcas de Productos</SheetTitle>
            <SheetDescription>
              Importa marcas de productos desde un archivo CSV o Excel.
            </SheetDescription>
          </SheetHeader>

          <DataImport
            schema={productBrandImportSchema}
            onImport={handleImport}
            isLoading={createProductBrandBulk.isPending}
            templateName="marcas_productos_template.csv"
            error={createProductBrandBulk.error?.message}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

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
import { useProductCategoryCreateBulk } from '@/hooks/product-categories/use-product-category-create-bulk'
import {
  ProductCategoryCreateSchema,
  productCategoryImportSchema,
} from '@/schemas/product-categories.schema'

interface ProductCategoryImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryImport({
  open,
  onOpenChange,
}: ProductCategoryImportProps) {
  const createProductCategoryBulk = useProductCategoryCreateBulk()

  const handleImport = async (data: ProductCategoryCreateSchema[]) => {
    await createProductCategoryBulk.mutateAsync(data)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Categorías de Productos</SheetTitle>
          <SheetDescription>
            Importa categorías de productos desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={productCategoryImportSchema}
            onImport={handleImport}
            isLoading={createProductCategoryBulk.isPending}
            templateName="categorias_productos_template.csv"
            error={createProductCategoryBulk.error?.message}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

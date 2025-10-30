'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import useProductCreate from '@/hooks/products/use-product-create'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  CreateProductSchema,
  createProductSchema,
} from '@/schemas/products.schema'

interface ProductImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductImport({ open, onOpenChange }: ProductImportProps) {
  const [isLoading, setIsLoading] = useState(false)
  const createProduct = useProductCreate()

  const handleImport = async (data: CreateProductSchema) => {
    setIsLoading(true)
    try {
      let successCount = 0
      let errorCount = 0

      for (const product of data) {
        try {
          await createProduct.mutateAsync({
            ...product,
            is_service: false,
            is_active: true,
          })
          successCount++
        } catch (error) {
          errorCount++
          console.error('Error importing product:', error)
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} productos importados exitosamente`)
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} productos no pudieron ser importados`)
      }

      if (successCount > 0) {
        onOpenChange(false)
      }
    } catch (error) {
      toast.error('Error durante la importación')
      console.error('Import error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Productos</SheetTitle>
          <SheetDescription>
            Importa productos desde un archivo CSV o Excel. Los campos
            requeridos son: name, price, stock.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={createProductSchema}
            onImport={handleImport}
            isLoading={isLoading}
            templateName="productos_template.csv"
            title="Importar Productos"
            description="Importa productos desde un archivo CSV o Excel. Los campos requeridos son: name, price, stock."
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

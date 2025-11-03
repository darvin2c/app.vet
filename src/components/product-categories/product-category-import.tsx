'use client'

import { useState } from 'react'
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
  createProductCategorySchema,
  CreateProductCategorySchema,
} from '@/schemas/product-categories.schema'
import { toast } from 'sonner'

interface ProductCategoryImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCategoryImport({
  open,
  onOpenChange,
}: ProductCategoryImportProps) {
  const createProductCategoryBulk = useProductCategoryCreateBulk()

  const handleImport = async (data: CreateProductCategorySchema[]) => {
    try {
      await createProductCategoryBulk.mutateAsync(data)
      toast.success('Categorías de productos importadas exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al importar categorías de productos:', error)
    }
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
            schema={createProductCategorySchema}
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
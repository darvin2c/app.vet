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
import { useProductBrandCreateBulk } from '@/hooks/product-brands/use-product-brand-create-bulk'
import {
  createProductBrandSchema,
  CreateProductBrandSchema,
} from '@/schemas/product-brands.schema'
import { toast } from 'sonner'

interface ProductBrandImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductBrandImport({
  open,
  onOpenChange,
}: ProductBrandImportProps) {
  const createProductBrandBulk = useProductBrandCreateBulk()

  const handleImport = async (data: CreateProductBrandSchema[]) => {
    try {
      await createProductBrandBulk.mutateAsync(data)
      toast.success('Marcas de productos importadas exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al importar marcas de productos:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Marcas de Productos</SheetTitle>
          <SheetDescription>
            Importa marcas de productos desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={createProductBrandSchema}
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

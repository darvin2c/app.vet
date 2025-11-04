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
import { useProductUnitCreateBulk } from '@/hooks/product-units/use-product-unit-create-bulk'
import {
  createProductUnitSchema,
  CreateProductUnitSchema,
} from '@/schemas/product-units.schema'
import { toast } from 'sonner'

interface ProductUnitImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductUnitImport({
  open,
  onOpenChange,
}: ProductUnitImportProps) {
  const createProductUnitBulk = useProductUnitCreateBulk()

  const handleImport = async (data: CreateProductUnitSchema[]) => {
    try {
      await createProductUnitBulk.mutateAsync(data)
      toast.success('Unidades de productos importadas exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al importar unidades de productos:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Unidades de Productos</SheetTitle>
          <SheetDescription>
            Importa unidades de productos desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={createProductUnitSchema}
            onImport={handleImport}
            isLoading={createProductUnitBulk.isPending}
            templateName="unidades_productos_template.csv"
            error={createProductUnitBulk.error?.message}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

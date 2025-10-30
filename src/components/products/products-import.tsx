'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { DataImporter } from '@/components/ui/data-import'
import { ImportConfig, ImportResult } from '@/types/data-import.types'
import { createProductSchema, CreateProductSchema } from '@/schemas/products.schema'
import useProductCreate from '@/hooks/products/use-product-create'
import { toast } from 'sonner'
import { ScrollArea } from '../ui/scroll-area'

interface ProductsImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsImport({ open, onOpenChange }: ProductsImportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const { mutateAsync: createProduct } = useProductCreate()

  // Función para manejar la importación
  const handleImport = async (data: CreateProductSchema[]): Promise<void> => {
    setIsImporting(true)
    setImportResult(null)
    
    const startTime = Date.now()
    let imported = 0
    let failed = 0
    const errors: Array<{ row: number; message: string; data: any }> = []

    try {
      // Procesar cada producto
      for (let i = 0; i < data.length; i++) {
        const product = data[i]
        try {
          await createProduct(product)
          imported++
        } catch (error) {
          failed++
          errors.push({
            row: i + 1,
            message: error instanceof Error ? error.message : 'Error desconocido',
            data: product,
          })
        }
      }

      const duration = Date.now() - startTime
      const result: ImportResult = {
        success: failed === 0,
        imported,
        failed,
        errors,
        message: failed === 0 
          ? `Se importaron ${imported} productos correctamente`
          : `Se importaron ${imported} productos, ${failed} fallaron`,
      }

      setImportResult(result)

      if (result.success) {
        toast.success(`Productos importados correctamente: ${imported}`)
      } else {
        toast.error(`Importación completada con errores: ${failed} productos fallaron`)
      }
    } catch (error) {
      const result: ImportResult = {
        success: false,
        imported: 0,
        failed: data.length,
        errors: [{ row: 0, message: 'Error general en la importación', data: {} }],
        message: 'Error al importar productos',
      }

      setImportResult(result)
      toast.error('Error al importar productos')
    } finally {
      setIsImporting(false)
    }
  }

  const config: ImportConfig<CreateProductSchema> = {
    entityType: 'Productos',
    schema: createProductSchema,
    requiredColumns: [
      'name',
      'price',
      'cost',
      'stock',
      'category_id',
      'unit_id',
    ],
    optionalColumns: [
      'barcode',
      'sku',
      'notes',
      'is_service',
      'is_active',
      'brand_id',
    ],
    columnMappings: {
      name: {
        label: 'Nombre',
        description: 'Nombre del producto',
        example: 'Shampoo para perros',
        required: true,
      },
      price: {
        label: 'Precio',
        description: 'Precio de venta',
        example: '25.50',
        required: true,
        type: 'number',
      },
      cost: {
        label: 'Costo',
        description: 'Costo del producto',
        example: '15.00',
        required: true,
        type: 'number',
      },
      stock: {
        label: 'Stock',
        description: 'Cantidad en inventario',
        example: '100',
        required: true,
        type: 'number',
      },
      category_id: {
        label: 'ID Categoría',
        description: 'ID de la categoría del producto',
        example: 'cat_123',
        required: true,
      },
      unit_id: {
        label: 'ID Unidad',
        description: 'ID de la unidad de medida',
        example: 'unit_123',
        required: true,
      },
      barcode: {
        label: 'Código de Barras',
        description: 'Código de barras del producto',
        example: '1234567890123',
        required: false,
      },
      sku: {
        label: 'SKU',
        description: 'Código SKU del producto',
        example: 'SHAMP-001',
        required: false,
      },
      notes: {
        label: 'Notas',
        description: 'Notas adicionales',
        example: 'Producto especial para cachorros',
        required: false,
      },
      is_service: {
        label: 'Es Servicio',
        description: 'Indica si es un servicio (true/false)',
        example: 'false',
        required: false,
        type: 'boolean',
      },
      is_active: {
        label: 'Activo',
        description: 'Estado del producto (true/false)',
        example: 'true',
        required: false,
        type: 'boolean',
      },
      brand_id: {
        label: 'ID Marca',
        description: 'ID de la marca del producto',
        example: 'brand_123',
        required: false,
      },
    },
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    sampleData: [
      {
        name: 'Shampoo para perros',
        price: 25.5,
        cost: 15.0,
        stock: 100,
        category_id: 'cat_123',
        unit_id: 'unit_123',
        barcode: '1234567890123',
        sku: 'SHAMP-001',
        notes: 'Producto especial para cachorros',
        is_service: false,
        is_active: true,
        brand_id: 'brand_123',
      },
    ],
  }

  const handleComplete = (result: ImportResult) => {
    console.log('Importación completada:', result)
    // Mantener el sheet abierto para mostrar resultados
  }

  const handleCancel = () => {
    setIsImporting(false)
    setImportResult(null)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-6xl sm:max-w-6xl">
        <SheetHeader>
          <SheetTitle>Importar Productos</SheetTitle>
          <SheetDescription>
            Sube un archivo CSV o Excel para importar productos masivamente
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <DataImporter
            config={config}
            onComplete={handleComplete}
            onCancel={handleCancel}
            isImporting={isImporting}
            importResult={importResult}
            onImport={handleImport}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
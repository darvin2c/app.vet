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
import { CreateProductSchema } from '@/schemas/products.schema'
import useProductCreate from '@/hooks/products/use-product-create'
import { toast } from 'sonner'
import { ScrollArea } from '../ui/scroll-area'

interface ProductsImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsImport({ open, onOpenChange }: ProductsImportProps) {
  const [isImporting, setIsImporting] = useState(false)
  const productCreate = useProductCreate()

  // Configuración de importación para productos
  const importConfig: ImportConfig<CreateProductSchema> = {
    entityType: 'products',
    requiredColumns: ['name', 'price', 'stock'],
    maxRows: 1000,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],
    validationSchema: {
      name: {
        type: 'string',
        required: true,
        rules: [
          {
            type: 'minLength',
            value: 1,
            message: 'El nombre es requerido',
          },
        ],
      },
      price: {
        type: 'number',
        required: true,
        rules: [
          {
            type: 'min',
            value: 0,
            message: 'El precio debe ser mayor o igual a 0',
          },
        ],
        defaultValue: 0,
        transform: (value: any) => {
          const num = parseFloat(value)
          return isNaN(num) ? 0 : num
        },
      },
      stock: {
        type: 'number',
        required: true,
        rules: [
          {
            type: 'min',
            value: 0,
            message: 'El stock debe ser mayor o igual a 0',
          },
        ],
        defaultValue: 0,
        transform: (value: any) => {
          const num = parseFloat(value)
          return isNaN(num) ? 0 : num
        },
      },
      cost: {
        type: 'number',
        required: false,
        rules: [
          {
            type: 'min',
            value: 0,
            message: 'El costo debe ser mayor o igual a 0',
          },
        ],
        transform: (value: any) => {
          if (!value || value === '') return undefined
          const num = parseFloat(value)
          return isNaN(num) ? undefined : num
        },
      },
      barcode: {
        type: 'string',
        required: false,
      },
      sku: {
        type: 'string',
        required: false,
      },
      notes: {
        type: 'string',
        required: false,
      },
      tax_rate: {
        type: 'number',
        required: false,
        rules: [
          {
            type: 'min',
            value: 0,
            message: 'La tasa de impuesto debe ser mayor o igual a 0',
          },
          {
            type: 'max',
            value: 1,
            message: 'La tasa de impuesto debe ser menor o igual a 1',
          },
        ],
        transform: (value: any) => {
          if (!value || value === '') return undefined
          const num = parseFloat(value)
          return isNaN(num) ? undefined : num
        },
      },
      expiry_date: {
        type: 'date',
        required: false,
        transform: (value: any) => {
          if (!value || value === '') return undefined
          // Convertir a formato ISO si es necesario
          const date = new Date(value)
          return isNaN(date.getTime())
            ? undefined
            : date.toISOString().split('T')[0]
        },
      },
      batch_number: {
        type: 'string',
        required: false,
      },
      brand_id: {
        type: 'string',
        required: false,
        rules: [
          {
            type: 'custom',
            message: 'ID de marca inválido',
            validator: (value: any) => {
              if (!value || value === '') return true
              // Validar formato UUID básico
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
              return uuidRegex.test(value)
            },
          },
        ],
      },
      category_id: {
        type: 'string',
        required: false,
        rules: [
          {
            type: 'custom',
            message: 'ID de categoría inválido',
            validator: (value: any) => {
              if (!value || value === '') return true
              // Validar formato UUID básico
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
              return uuidRegex.test(value)
            },
          },
        ],
      },
      unit_id: {
        type: 'string',
        required: false,
        rules: [
          {
            type: 'custom',
            message: 'ID de unidad inválido',
            validator: (value: any) => {
              if (!value || value === '') return true
              // Validar formato UUID básico
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
              return uuidRegex.test(value)
            },
          },
        ],
      },
      is_service: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        transform: (value: any) => {
          if (typeof value === 'boolean') return value
          if (typeof value === 'string') {
            const lower = value.toLowerCase()
            return (
              lower === 'true' ||
              lower === '1' ||
              lower === 'sí' ||
              lower === 'si'
            )
          }
          return false
        },
      },
      is_active: {
        type: 'boolean',
        required: false,
        defaultValue: true,
        transform: (value: any) => {
          if (typeof value === 'boolean') return value
          if (typeof value === 'string') {
            const lower = value.toLowerCase()
            return (
              lower === 'true' ||
              lower === '1' ||
              lower === 'sí' ||
              lower === 'si'
            )
          }
          return true
        },
      },
    },
    importFunction: async (
      data: CreateProductSchema[]
    ): Promise<ImportResult> => {
      setIsImporting(true)
      const startTime = Date.now()
      let imported = 0
      let failed = 0
      const errors: Array<{ row: number; message: string; data: any }> = []

      try {
        for (let i = 0; i < data.length; i++) {
          try {
            await productCreate.mutateAsync(data[i])
            imported++
          } catch (error) {
            failed++
            errors.push({
              row: i + 1,
              message:
                error instanceof Error ? error.message : 'Error desconocido',
              data: data[i],
            })
          }
        }

        const duration = Date.now() - startTime

        return {
          success: imported > 0,
          imported,
          failed,
          errors,
          duration,
        }
      } finally {
        setIsImporting(false)
      }
    },
  }

  const handleComplete = (result: ImportResult) => {
    console.log(result)
    if (result.success) {
      toast.success(
        `Importación completada: ${result.imported} productos importados${
          result.failed > 0 ? `, ${result.failed} fallaron` : ''
        }`
      )
    } else {
      toast.error('La importación falló completamente')
    }
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-6xl sm:max-w-6xl">
        <SheetHeader>
          <SheetTitle>Importar Productos</SheetTitle>
          <SheetDescription>
            Importa productos desde un archivo CSV o Excel. Los campos
            requeridos son: nombre, precio y stock.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full">
          <DataImporter<CreateProductSchema>
            config={importConfig}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

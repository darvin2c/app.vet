'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DataImporter } from '@/components/ui/data-import'
import type { ImportConfig, ImportResult } from '@/types/data-import.types'

// Esquemas de validación
const ProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  category: z.string().min(1, 'La categoría es requerida'),
  stock: z.number().int().min(0, 'El stock debe ser un número entero positivo'),
  description: z.string().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  active: z.boolean().default(true),
})

// Esquema para clientes
const ClientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address: z.string().optional(),
  city: z.string().min(1, 'La ciudad es requerida'),
  document_number: z.string().min(1, 'El número de documento es requerido'),
  document_type: z.enum(['DNI', 'RUC', 'CE'], {
    message: 'Tipo de documento debe ser DNI, RUC o CE',
  }),
})

type DemoEntity = 'products' | 'clients'

interface Product {
  name: string
  price: number
  category: string
  stock: number
  description?: string
  sku: string
  active: boolean
}

interface Client {
  name: string
  email?: string
  phone: string
  address?: string
  city: string
  document_number: string
  document_type: 'DNI' | 'RUC' | 'CE'
}

export default function DataImportDemo() {
  const [selectedEntity, setSelectedEntity] = useState<DemoEntity>('products')
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // Función para manejar la importación de productos
  const handleProductImport = async (data: Product[]): Promise<void> => {
    setIsImporting(true)
    setImportResult(null)

    try {
      // Simular importación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result: ImportResult = {
        success: true,
        imported: data.length,
        failed: 0,
        errors: [],
        message: `Se importaron ${data.length} productos correctamente`,
      }

      setImportResult(result)
    } catch (error) {
      const result: ImportResult = {
        success: false,
        imported: 0,
        failed: data.length,
        errors: [{ row: 0, message: 'Error en la importación', data: {} }],
        message: 'Error al importar productos',
      }

      setImportResult(result)
    } finally {
      setIsImporting(false)
    }
  }

  // Función para manejar la importación de clientes
  const handleClientImport = async (data: Client[]): Promise<void> => {
    setIsImporting(true)
    setImportResult(null)

    try {
      // Simular importación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result: ImportResult = {
        success: true,
        imported: data.length,
        failed: 0,
        errors: [],
        message: `Se importaron ${data.length} clientes correctamente`,
      }

      setImportResult(result)
    } catch (error) {
      const result: ImportResult = {
        success: false,
        imported: 0,
        failed: data.length,
        errors: [{ row: 0, message: 'Error en la importación', data: {} }],
        message: 'Error al importar clientes',
      }

      setImportResult(result)
    } finally {
      setIsImporting(false)
    }
  }

  // Configuración para productos
  const productConfig: ImportConfig<Product> = {
    entityType: 'Productos',
    schema: ProductSchema,
    requiredColumns: ['name', 'price', 'category', 'stock', 'sku'],
    optionalColumns: ['description', 'active'],
    columnMappings: {
      name: {
        label: 'Nombre del Producto',
        description: 'Nombre único del producto',
        example: 'Laptop Dell Inspiron',
        required: true,
      },
      price: {
        label: 'Precio',
        description: 'Precio de venta del producto',
        example: '1299.99',
        required: true,
        type: 'number',
      },
      category: {
        label: 'Categoría',
        description: 'Categoría del producto',
        example: 'Electrónicos',
        required: true,
      },
      stock: {
        label: 'Stock',
        description: 'Cantidad disponible en inventario',
        example: '50',
        required: true,
        type: 'number',
      },
      description: {
        label: 'Descripción',
        description: 'Descripción detallada del producto',
        example: 'Laptop para uso profesional...',
        required: false,
      },
      sku: {
        label: 'SKU',
        description: 'Código único del producto',
        example: 'DELL-INSP-001',
        required: true,
      },
      active: {
        label: 'Activo',
        description: 'Estado del producto (true/false)',
        example: 'true',
        required: false,
        type: 'boolean',
      },
    },
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    sampleData: [
      {
        name: 'Laptop Dell Inspiron',
        price: 1299.99,
        category: 'Electrónicos',
        stock: 25,
        description: 'Laptop para uso profesional con procesador Intel i7',
        sku: 'DELL-INSP-001',
        active: true,
      },
      {
        name: 'Mouse Inalámbrico',
        price: 29.99,
        category: 'Accesorios',
        stock: 100,
        description: 'Mouse inalámbrico ergonómico',
        sku: 'MOUSE-WIRELESS-001',
        active: true,
      },
    ],
  }

  // Configuración para clientes
  const clientConfig: ImportConfig<Client> = {
    entityType: 'Clientes',
    schema: ClientSchema,
    requiredColumns: ['name', 'phone', 'city', 'document_number', 'document_type'],
    optionalColumns: ['email', 'address'],
    columnMappings: {
      name: {
        label: 'Nombre Completo',
        description: 'Nombre completo del cliente',
        example: 'Juan Pérez García',
        required: true,
      },
      email: {
        label: 'Email',
        description: 'Correo electrónico del cliente',
        example: 'juan.perez@email.com',
        required: false,
        type: 'email',
      },
      phone: {
        label: 'Teléfono',
        description: 'Número de teléfono del cliente',
        example: '+51 999 888 777',
        required: true,
      },
      address: {
        label: 'Dirección',
        description: 'Dirección completa del cliente',
        example: 'Av. Principal 123, San Isidro',
        required: false,
      },
      city: {
        label: 'Ciudad',
        description: 'Ciudad de residencia',
        example: 'Lima',
        required: true,
      },
      document_number: {
        label: 'Número de Documento',
        description: 'Número de documento de identidad',
        example: '12345678',
        required: true,
      },
      document_type: {
        label: 'Tipo de Documento',
        description: 'Tipo de documento (DNI, RUC, CE)',
        example: 'DNI',
        required: true,
        type: 'select',
        options: ['DNI', 'RUC', 'CE'],
      },
    },
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    sampleData: [
      {
        name: 'Juan Pérez García',
        email: 'juan.perez@email.com',
        phone: '+51 999 888 777',
        address: 'Av. Principal 123, San Isidro',
        city: 'Lima',
        document_number: '12345678',
        document_type: 'DNI' as const,
      },
      {
        name: 'María González López',
        email: 'maria.gonzalez@email.com',
        phone: '+51 888 777 666',
        address: 'Jr. Los Olivos 456, Miraflores',
        city: 'Lima',
        document_number: '87654321',
        document_type: 'DNI' as const,
      },
    ],
  }

  const handleComplete = (result: ImportResult) => {
    console.log('Importación completada:', result)
    setImportResult(result)
  }

  const handleCancel = () => {
    setIsImporting(false)
    setImportResult(null)
  }

  const getImportHandler = () => {
    return selectedEntity === 'products' ? handleProductImport : handleClientImport
  }

  const getCurrentConfig = () => {
    return selectedEntity === 'products' ? productConfig : clientConfig
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Demo - Importador de Datos</h1>
        <p className="text-muted-foreground">
          Demostración del componente DataImporter con diferentes tipos de entidades.
        </p>
      </div>

      {/* Selector de entidad */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Entidad</CardTitle>
          <CardDescription>
            Elige el tipo de datos que deseas importar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={selectedEntity === 'products' ? 'default' : 'outline'}
              onClick={() => setSelectedEntity('products')}
            >
              Productos
            </Button>
            <Button
              variant={selectedEntity === 'clients' ? 'default' : 'outline'}
              onClick={() => setSelectedEntity('clients')}
            >
              Clientes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estado de importación */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Resultado de Importación
              <Badge variant={importResult.success ? 'default' : 'destructive'}>
                {importResult.success ? 'Exitoso' : 'Error'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>{importResult.message}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Importados: {importResult.imported}</span>
                <span>Fallidos: {importResult.failed}</span>
              </div>
              {importResult.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Errores:</h4>
                  <ul className="space-y-1 text-sm">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="text-red-600">
                        Fila {error.row}: {error.message}
                      </li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li className="text-muted-foreground">
                        ... y {importResult.errors.length - 5} errores más
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Importador */}
      <Card>
        <CardHeader>
          <CardTitle>
            Importar {selectedEntity === 'products' ? 'Productos' : 'Clientes'}
          </CardTitle>
          <CardDescription>
            Sube un archivo CSV o Excel para importar datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedEntity === 'products' ? (
            <DataImporter<Product>
              config={productConfig}
              onComplete={handleComplete}
              onCancel={handleCancel}
              isImporting={isImporting}
              importResult={importResult}
              onImport={handleProductImport}
            />
          ) : (
            <DataImporter<Client>
              config={clientConfig}
              onComplete={handleComplete}
              onCancel={handleCancel}
              isImporting={isImporting}
              importResult={importResult}
              onImport={handleClientImport}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

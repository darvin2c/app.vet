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

// Esquema de validación para productos
const ProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  category: z.string().min(1, 'La categoría es requerida'),
  stock: z.number().int().min(0, 'El stock debe ser un número entero positivo'),
  description: z.string().optional(),
  sku: z.string().min(1, 'El SKU es requerido'),
  active: z.boolean().default(true),
})

// Esquema de validación para clientes
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
  const [selectedEntity, setSelectedEntity] = useState<DemoEntity | null>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)

  // Configuración para productos
  const productConfig: ImportConfig<Product> = {
    entityType: 'Productos',
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    validationSchema: {
      name: {
        type: 'string',
        required: true,
        rules: [
          { type: 'minLength', value: 1, message: 'El nombre es requerido' },
        ],
      },
      price: {
        type: 'number',
        required: true,
        rules: [
          { type: 'min', value: 0, message: 'El precio debe ser mayor a 0' },
        ],
      },
      category: {
        type: 'string',
        required: true,
        rules: [
          { type: 'minLength', value: 1, message: 'La categoría es requerida' },
        ],
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
      },
      description: {
        type: 'string',
        required: false,
      },
      sku: {
        type: 'string',
        required: true,
        rules: [
          { type: 'minLength', value: 1, message: 'El SKU es requerido' },
        ],
      },
      active: {
        type: 'boolean',
        required: false,
        defaultValue: true,
      },
    },
    requiredColumns: ['name', 'price', 'category', 'stock', 'sku'],
    importFunction: async (data: Product[]) => {
      // Simular importación
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular algunos errores
      const errors = data
        .slice(0, Math.floor(data.length * 0.1))
        .map((item, index) => ({
          row: index,
          message: 'SKU duplicado en la base de datos',
          data: item,
        }))

      return {
        success: true,
        imported: data.length - errors.length,
        failed: errors.length,
        errors,
        duration: 2000,
      }
    },
  }

  // Configuración para clientes
  const clientConfig: ImportConfig<Client> = {
    entityType: 'Clientes',
    allowedFileTypes: ['.csv', '.xlsx', '.xls'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    validationSchema: {
      name: {
        type: 'string',
        required: true,
        rules: [
          { type: 'minLength', value: 1, message: 'El nombre es requerido' },
        ],
      },
      email: {
        type: 'string',
        required: false,
        rules: [{ type: 'email', message: 'Email inválido' }],
      },
      phone: {
        type: 'string',
        required: true,
        rules: [
          { type: 'minLength', value: 1, message: 'El teléfono es requerido' },
        ],
      },
      address: {
        type: 'string',
        required: false,
      },
      city: {
        type: 'string',
        required: true,
        rules: [
          { type: 'minLength', value: 1, message: 'La ciudad es requerida' },
        ],
      },
      document_number: {
        type: 'string',
        required: true,
        rules: [
          {
            type: 'minLength',
            value: 1,
            message: 'El número de documento es requerido',
          },
        ],
      },
      document_type: {
        type: 'string',
        required: true,
        rules: [
          {
            type: 'enum',
            values: ['DNI', 'RUC', 'CE'],
            message: 'Tipo de documento debe ser DNI, RUC o CE',
          },
        ],
      },
    },
    requiredColumns: [
      'name',
      'phone',
      'city',
      'document_number',
      'document_type',
    ],
    importFunction: async (data: Client[]) => {
      // Simular importación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        imported: data.length,
        failed: 0,
        errors: [],
        duration: 1500,
      }
    },
  }

  const handleImportComplete = (result: ImportResult) => {
    setImportResult(result)
    console.log('Importación completada:', result)
  }

  const handleCancel = () => {
    setSelectedEntity(null)
    setImportResult(null)
  }

  const resetDemo = () => {
    setSelectedEntity(null)
    setImportResult(null)
  }

  if (selectedEntity) {
    return (
      <div className="container mx-auto py-8">
        {selectedEntity === 'products' ? (
          <DataImporter<Product>
            config={productConfig}
            onComplete={handleImportComplete}
            onCancel={handleCancel}
          />
        ) : (
          <DataImporter<Client>
            config={clientConfig}
            onComplete={handleImportComplete}
            onCancel={handleCancel}
          />
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demo: Componente de Importación de Datos
          </h1>
          <p className="text-lg text-gray-600">
            Componente reutilizable para importar datos de cualquier entidad con
            validación y mapeo de columnas.
          </p>
        </div>

        {importResult && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">
                ¡Importación Completada!
              </CardTitle>
              <CardDescription>
                Los datos se han importado exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.imported}
                  </div>
                  <div className="text-sm text-gray-600">Importados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.failed}
                  </div>
                  <div className="text-sm text-gray-600">Fallidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.duration}ms
                  </div>
                  <div className="text-sm text-gray-600">Duración</div>
                </div>
                <div className="text-center">
                  <Badge
                    variant={importResult.success ? 'default' : 'destructive'}
                  >
                    {importResult.success ? 'Éxito' : 'Error'}
                  </Badge>
                </div>
              </div>
              <Button onClick={resetDemo} variant="outline">
                Realizar otra importación
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📦 Importar Productos
                <Badge variant="secondary">Demo</Badge>
              </CardTitle>
              <CardDescription>
                Importa productos con validación de precios, stock, SKU y
                categorías.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Columnas requeridas:</strong> name, price, category,
                  stock, sku
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Columnas opcionales:</strong> description, active
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Validaciones:</strong> Precios &gt; 0, Stock ≥ 0, SKU
                  único
                </p>
              </div>
              <Button
                onClick={() => setSelectedEntity('products')}
                className="w-full"
              >
                Comenzar Importación
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 Importar Clientes
                <Badge variant="secondary">Demo</Badge>
              </CardTitle>
              <CardDescription>
                Importa clientes con validación de emails, documentos y datos de
                contacto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Columnas requeridas:</strong> name, phone, city,
                  document_number, document_type
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Columnas opcionales:</strong> email, address
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Validaciones:</strong> Email válido, Tipo documento
                  (DNI/RUC/CE)
                </p>
              </div>
              <Button
                onClick={() => setSelectedEntity('clients')}
                className="w-full"
              >
                Comenzar Importación
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Características del Componente</CardTitle>
            <CardDescription>
              Funcionalidades incluidas en el componente de importación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📁 Paso 1: Subir Archivo</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Drag &amp; drop de archivos</li>
                  <li>• Soporte CSV y Excel (.xlsx, .xls)</li>
                  <li>• Validación de tipo y tamaño</li>
                  <li>• Feedback visual del estado</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  🔍 Paso 2: Verificar Datos
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Vista previa en tabla</li>
                  <li>• Validación en tiempo real</li>
                  <li>• Mapeo de columnas</li>
                  <li>• Filtros por errores</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✅ Paso 3: Confirmar</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Resumen de importación</li>
                  <li>• Barra de progreso</li>
                  <li>• Manejo de errores</li>
                  <li>• Resultados detallados</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">⚙️ Configuración</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Completamente reutilizable</li>
                  <li>• Esquemas de validación flexibles</li>
                  <li>• Función de importación personalizable</li>
                  <li>• TypeScript con tipos estrictos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

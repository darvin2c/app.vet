'use client'

import { useState } from 'react'
import { z } from 'zod'
import { DataImport } from '@/components/ui/data-import'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Esquema de ejemplo para productos
const ProductSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  code: z.string().nonempty('El código es requerido'),
  price: z.coerce.number().min(0, 'El precio debe ser mayor a 0'),
  category: z.string().nonempty('La categoría es requerida'),
  stock: z.coerce
    .number()
    .int()
    .min(0, 'El stock debe ser un número entero positivo'),
  description: z.string().optional(),
})

type Product = z.infer<typeof ProductSchema>

// Esquema de ejemplo para clientes
const CustomerSchema = z.object({
  name: z.string().nonempty('El nombre es requerido'),
  email: z
    .string()
    .email('Formato de email inválido')
    .optional()
    .or(z.literal('')),
  phone: z.string().nonempty('El teléfono es requerido'),
  address: z.string().optional(),
  document_number: z.string().nonempty('El número de documento es requerido'),
})

type Customer = z.infer<typeof CustomerSchema>

export default function DataImportDemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [importType, setImportType] = useState<'products' | 'customers'>(
    'products'
  )

  const handleProductImport = async (data: Product[]) => {
    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Productos importados:', data)
      toast.success(`Se importaron ${data.length} productos exitosamente`)
    } catch (error) {
      toast.error('Error al importar productos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCustomerImport = async (data: Customer[]) => {
    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Clientes importados:', data)
      toast.success(`Se importaron ${data.length} clientes exitosamente`)
    } catch (error) {
      toast.error('Error al importar clientes')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Demo - Componente DataImport
        </h1>
        <p className="text-muted-foreground mb-6">
          Ejemplo de uso del componente reutilizable DataImport con diferentes
          esquemas de validación.
        </p>

        <div className="flex gap-4 mb-6">
          <Button
            variant={importType === 'products' ? 'default' : 'outline'}
            onClick={() => setImportType('products')}
          >
            Importar Productos
          </Button>
          <Button
            variant={importType === 'customers' ? 'default' : 'outline'}
            onClick={() => setImportType('customers')}
          >
            Importar Clientes
          </Button>
        </div>
      </div>

      {importType === 'products' && (
        <DataImport<Product>
          schema={ProductSchema}
          onImport={handleProductImport}
          isLoading={isLoading}
          title="Importar Productos"
          description="Importa productos desde un archivo CSV o Excel. Los campos requeridos son: name, code, price, category, stock."
          templateName="productos-template.csv"
          acceptedFileTypes={['.csv', '.xlsx', '.xls']}
          maxFileSize={5 * 1024 * 1024} // 5MB
        />
      )}

      {importType === 'customers' && (
        <DataImport<Customer>
          schema={CustomerSchema}
          onImport={handleCustomerImport}
          isLoading={isLoading}
          title="Importar Clientes"
          description="Importa clientes desde un archivo CSV o Excel. Los campos requeridos son: name, phone, document_number."
          templateName="clientes-template.csv"
          acceptedFileTypes={['.csv', '.xlsx', '.xls']}
          maxFileSize={5 * 1024 * 1024} // 5MB
        />
      )}

      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Características del componente:
        </h3>
        <ul className="space-y-2 text-sm">
          <li>✅ Validación con esquemas Zod personalizables</li>
          <li>✅ Soporte para archivos CSV y Excel (.xlsx, .xls)</li>
          <li>✅ Plantilla descargable generada automáticamente</li>
          <li>✅ Validación en tiempo real con errores detallados</li>
          <li>✅ Interfaz de 3 pasos: Upload → Validate → Confirm</li>
          <li>✅ Estados de carga manejados externamente</li>
          <li>✅ Completamente tipado con TypeScript</li>
          <li>✅ Reutilizable y modular</li>
        </ul>
      </div>
    </div>
  )
}

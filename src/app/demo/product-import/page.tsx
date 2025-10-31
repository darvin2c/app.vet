'use client'

import { ProductImportButton } from '@/components/products/product-import-button'

export default function ProductImportDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Demo - Importación de Productos
          </h1>
          <p className="text-muted-foreground mt-2">
            Prueba la funcionalidad de importación de productos desde archivos
            CSV o Excel
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Importar Productos</h2>
              <p className="text-sm text-muted-foreground">
                Haz clic en el botón para abrir el diálogo de importación
              </p>
            </div>
            <ProductImportButton />
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Campos soportados:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium text-red-600">• name</span>{' '}
                (requerido)
              </div>
              <div>
                <span className="font-medium text-red-600">• price</span>{' '}
                (requerido)
              </div>
              <div>
                <span className="font-medium text-red-600">• stock</span>{' '}
                (requerido)
              </div>
              <div>
                <span className="text-muted-foreground">• cost</span> (opcional)
              </div>
              <div>
                <span className="text-muted-foreground">• barcode</span>{' '}
                (opcional)
              </div>
              <div>
                <span className="text-muted-foreground">• sku</span> (opcional)
              </div>
              <div>
                <span className="text-muted-foreground">• notes</span>{' '}
                (opcional)
              </div>
              <div>
                <span className="text-muted-foreground">• category_id</span>{' '}
                (opcional)
              </div>
              <div>
                <span className="text-muted-foreground">• brand_id</span>{' '}
                (opcional)
              </div>
              <div>
                <span className="text-muted-foreground">• unit_id</span>{' '}
                (opcional)
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Instrucciones:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Haz clic en "Importar" para abrir el diálogo</li>
              <li>2. Descarga la plantilla CSV si necesitas un ejemplo</li>
              <li>3. Sube tu archivo CSV o Excel con los datos de productos</li>
              <li>4. Revisa los datos validados en la tabla</li>
              <li>5. Confirma la importación para crear los productos</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

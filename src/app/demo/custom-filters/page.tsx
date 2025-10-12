'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Filters } from '@/components/ui/filters'
import { FilterConfig } from '@/types/filters.types'
import { ProductCategorySelect } from '@/components/product-categories/product-category-select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CustomFiltersDemo() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})

  // Configuración de filtros con componente personalizado
  const customFilters: FilterConfig[] = [
    {
      key: 'search',
      field: 'search',
      type: 'search',
      label: 'Buscar',
      placeholder: 'Buscar productos...',
      operator: 'ilike',
    },
    {
      key: 'category_id',
      field: 'category_id',
      type: 'custom',
      label: 'Categoría',
      operator: 'eq',
      component: <ProductCategorySelect placeholder="Selecciona categoría" />,
    },
    {
      key: 'is_active',
      field: 'is_active',
      type: 'boolean',
      label: 'Estado',
      placeholder: 'Selecciona estado',
      operator: 'eq',
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/demo">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Demos
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-2">Custom Filters Demo</h1>
          <p className="text-muted-foreground">
            Demostración del sistema de filtros con componentes personalizados
          </p>
        </div>

        {/* Demo Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros con Componente Personalizado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Este ejemplo muestra cómo usar el tipo de filtro 'custom' para
                integrar componentes personalizados en el sistema de filtros.
              </p>

              <div className="border rounded-lg p-4">
                <Filters filters={customFilters} />
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Filtro Custom</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                {`const customFilters: FilterConfig[] = [
  {
    key: 'category_id',
    field: 'category_id',
    type: 'custom',
    label: 'Categoría',
    operator: 'eq',
    component: <ProductCategorySelect placeholder="Selecciona categoría" />,
  },
]`}
              </pre>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Características</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Ventajas</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Integración completa con el sistema de filtros</li>
                    <li>• Persistencia automática en URL</li>
                    <li>• Soporte para operadores de Supabase</li>
                    <li>• Reutilización de componentes existentes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Casos de Uso</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Selectores con lógica compleja</li>
                    <li>• Componentes con estado interno</li>
                    <li>• Filtros con validación personalizada</li>
                    <li>• Integraciones con APIs externas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notas de Implementación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  TypeScript
                </Badge>
                <p className="text-sm text-muted-foreground">
                  El tipo{' '}
                  <code className="bg-muted px-1 rounded">
                    CustomFilterConfig
                  </code>
                  extiende la configuración base con una propiedad{' '}
                  <code className="bg-muted px-1 rounded">component</code>
                  de tipo{' '}
                  <code className="bg-muted px-1 rounded">React.ReactNode</code>
                  .
                </p>
              </div>

              <div>
                <Badge variant="outline" className="mb-2">
                  Props Injection
                </Badge>
                <p className="text-sm text-muted-foreground">
                  El sistema automáticamente inyecta las props{' '}
                  <code className="bg-muted px-1 rounded">value</code>y{' '}
                  <code className="bg-muted px-1 rounded">onChange</code> al
                  componente personalizado usando{' '}
                  <code className="bg-muted px-1 rounded">
                    React.cloneElement
                  </code>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

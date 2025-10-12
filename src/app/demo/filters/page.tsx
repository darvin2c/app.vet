'use client'

import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Code,
  Eye,
  Filter,
  Search,
  Calendar,
  CheckSquare,
  Hash,
  List,
  ToggleLeft,
} from 'lucide-react'
import { Filters } from '@/components/ui/filters'
import type { FiltersConfig, AppliedFilter } from '@/types/filters.types'

export default function FiltersDemoPage() {
  // Estados para cada demo
  const [searchFilters, setSearchFilters] = useState<AppliedFilter[]>([])
  const [selectFilters, setSelectFilters] = useState<AppliedFilter[]>([])
  const [multiselectFilters, setMultiselectFilters] = useState<AppliedFilter[]>(
    []
  )
  const [dateFilters, setDateFilters] = useState<AppliedFilter[]>([])
  const [dateRangeFilters, setDateRangeFilters] = useState<AppliedFilter[]>([])
  const [booleanFilters, setBooleanFilters] = useState<AppliedFilter[]>([])
  const [numberFilters, setNumberFilters] = useState<AppliedFilter[]>([])
  const [combinedFilters, setCombinedFilters] = useState<AppliedFilter[]>([])

  // Configuraciones de filtros para cada demo
  const searchFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'search_name',
        field: 'name',
        type: 'search',
        label: 'Buscar por nombre',
        placeholder: 'Escribe el nombre...',
        operator: 'ilike',
      },
      {
        key: 'search_email',
        field: 'email',
        type: 'search',
        label: 'Buscar por email',
        placeholder: 'Ingresa el email...',
        operator: 'ilike',
      },
    ],
    onFiltersChange: setSearchFilters,
  }

  const selectFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'status',
        field: 'status',
        type: 'select',
        label: 'Estado',
        placeholder: 'Selecciona un estado',
        operator: 'eq',
        options: [
          { value: 'active', label: 'Activo' },
          { value: 'inactive', label: 'Inactivo' },
          { value: 'pending', label: 'Pendiente' },
        ],
      },
      {
        key: 'category',
        field: 'category',
        type: 'select',
        label: 'Categoría',
        placeholder: 'Selecciona una categoría',
        operator: 'eq',
        options: [
          { value: 'tech', label: 'Tecnología' },
          { value: 'business', label: 'Negocios' },
          { value: 'design', label: 'Diseño' },
        ],
      },
    ],
    onFiltersChange: setSelectFilters,
  }

  const multiselectFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'tags',
        field: 'tags',
        type: 'multiselect',
        label: 'Etiquetas',
        placeholder: 'Selecciona etiquetas',
        operator: 'contains',
        options: [
          { value: 'urgent', label: 'Urgente' },
          { value: 'important', label: 'Importante' },
          { value: 'review', label: 'Revisión' },
          { value: 'approved', label: 'Aprobado' },
        ],
      },
    ],
    onFiltersChange: setMultiselectFilters,
  }

  const dateFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'created_date',
        field: 'created_at',
        type: 'date',
        label: 'Fecha de creación',
        placeholder: 'Selecciona una fecha',
        operator: 'eq',
      },
      {
        key: 'updated_after',
        field: 'updated_at',
        type: 'date',
        label: 'Actualizado después de',
        placeholder: 'Selecciona una fecha',
        operator: 'gte',
      },
    ],
    onFiltersChange: setDateFilters,
  }

  const dateRangeFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'date_range',
        field: 'created_at',
        type: 'dateRange',
        label: 'Rango de fechas',
        placeholder: 'Selecciona un rango',
        operator: 'gte',
      },
    ],
    onFiltersChange: setDateRangeFilters,
  }

  const booleanFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'is_active',
        field: 'is_active',
        type: 'boolean',
        label: '¿Está activo?',
        placeholder: 'Selecciona una opción',
        operator: 'eq',
      },
      {
        key: 'has_image',
        field: 'has_image',
        type: 'boolean',
        label: '¿Tiene imagen?',
        placeholder: 'Selecciona una opción',
        operator: 'eq',
      },
    ],
    onFiltersChange: setBooleanFilters,
  }

  const numberFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'min_price',
        field: 'price',
        type: 'number',
        label: 'Precio mínimo',
        placeholder: 'Ingresa el precio mínimo',
        operator: 'gte',
      },
      {
        key: 'max_quantity',
        field: 'quantity',
        type: 'number',
        label: 'Cantidad máxima',
        placeholder: 'Ingresa la cantidad máxima',
        operator: 'lte',
      },
    ],
    onFiltersChange: setNumberFilters,
  }

  const combinedFiltersConfig: FiltersConfig = {
    filters: [
      {
        key: 'search_product',
        field: 'name',
        type: 'search',
        label: 'Buscar producto',
        placeholder: 'Nombre del producto...',
        operator: 'ilike',
      },
      {
        key: 'product_status',
        field: 'status',
        type: 'select',
        label: 'Estado del producto',
        placeholder: 'Selecciona estado',
        operator: 'eq',
        options: [
          { value: 'available', label: 'Disponible' },
          { value: 'out_of_stock', label: 'Agotado' },
          { value: 'discontinued', label: 'Descontinuado' },
        ],
      },
      {
        key: 'product_tags',
        field: 'tags',
        type: 'multiselect',
        label: 'Etiquetas del producto',
        placeholder: 'Selecciona etiquetas',
        operator: 'contains',
        options: [
          { value: 'new', label: 'Nuevo' },
          { value: 'sale', label: 'En oferta' },
          { value: 'featured', label: 'Destacado' },
        ],
      },
      {
        key: 'price_range',
        field: 'price',
        type: 'dateRange',
        label: 'Rango de precios',
        placeholder: 'Selecciona rango',
        operator: 'gte',
      },
      {
        key: 'is_featured',
        field: 'is_featured',
        type: 'boolean',
        label: '¿Es destacado?',
        placeholder: 'Selecciona opción',
        operator: 'eq',
      },
    ],
    onFiltersChange: setCombinedFilters,
  }

  // Función para renderizar filtros aplicados
  const renderAppliedFilters = (filters: AppliedFilter[]) => {
    if (filters.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          No hay filtros aplicados
        </p>
      )
    }

    return (
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {filter.field}: {String(filter.value)}
          </Badge>
        ))}
      </div>
    )
  }

  // Función para renderizar código de ejemplo
  const renderCodeExample = (config: any, title: string) => (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Code className="h-4 w-4" />
        <span className="text-sm font-medium">Código de ejemplo</span>
      </div>
      <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
        <code>{`// Configuración del filtro
const ${title.toLowerCase().replace(/\s+/g, '')}Config: FiltersConfig = {
  filters: ${JSON.stringify(config.filters, null, 2)},
  onFiltersChange: set${title.replace(/\s+/g, '')}Filters,
}

// Uso del componente
<Filters {...${title.toLowerCase().replace(/\s+/g, '')}Config} />`}</code>
      </pre>
    </div>
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Demos de Filtros</h1>
          <p className="text-muted-foreground">
            Explora y prueba los diferentes tipos de filtros disponibles en el
            sistema. Cada filtro incluye documentación completa, ejemplos de
            código y casos de uso.
          </p>
        </div>

        {/* Filtros de Búsqueda */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              <CardTitle>Filtros de Búsqueda</CardTitle>
            </div>
            <CardDescription>
              Filtros de texto para búsquedas con operadores LIKE e ILIKE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...searchFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(searchFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite realizar búsquedas de texto en campos específicos
                    usando operadores PostgreSQL como <code>ilike</code>{' '}
                    (insensible a mayúsculas) o <code>like</code> (sensible).
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'search' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'like' | 'ilike' (requerido)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>?search_name=juan&search_email=gmail</code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>
                      .ilike('name', '%juan%').ilike('email', '%gmail%')
                    </code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Usa <code>ilike</code> para búsquedas insensibles a
                    mayúsculas
                  </li>
                  <li>
                    • Incluye debounce automático de 400ms para optimizar
                    rendimiento
                  </li>
                  <li>
                    • Los valores se envuelven automáticamente con % para
                    búsqueda parcial
                  </li>
                  <li>
                    • Ideal para campos de texto como nombres, emails,
                    descripciones
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(searchFiltersConfig, 'Search Filters')}
          </CardContent>
        </Card>

        {/* Filtros de Selección */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <List className="h-5 w-5" />
              <CardTitle>Filtros de Selección</CardTitle>
            </div>
            <CardDescription>
              Filtros de selección única con opciones predefinidas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...selectFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(selectFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite filtrar por valores específicos usando una lista de
                    opciones predefinidas. Ideal para campos con valores
                    limitados como estados, categorías, tipos.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'select' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'eq' | 'neq' (requerido)
                    </li>
                    <li>
                      <strong>options:</strong> Array de {'{value, label}'}{' '}
                      (requerido)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>?status=active&category=tech</code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>.eq('status', 'active').eq('category', 'tech')</code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Perfecto para campos con valores limitados y conocidos
                  </li>
                  <li>
                    • Usa <code>eq</code> para igualdad exacta
                  </li>
                  <li>• Incluye opción "Todos" para limpiar el filtro</li>
                  <li>• Las opciones deben tener value y label definidos</li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(selectFiltersConfig, 'Select Filters')}
          </CardContent>
        </Card>

        {/* Filtros de Selección Múltiple */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              <CardTitle>Filtros de Selección Múltiple</CardTitle>
            </div>
            <CardDescription>
              Filtros que permiten seleccionar múltiples opciones
              simultáneamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...multiselectFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(multiselectFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite seleccionar múltiples valores de una lista de
                    opciones. Útil para filtrar por etiquetas, categorías
                    múltiples, o cualquier campo que pueda tener varios valores.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'multiselect' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'contains' | 'in' (requerido)
                    </li>
                    <li>
                      <strong>options:</strong> Array de {'{value, label}'}{' '}
                      (requerido)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong> <code>?tags=urgent,important</code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>.contains('tags', ['urgent', 'important'])</code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Usa <code>contains</code> para arrays JSON en PostgreSQL
                  </li>
                  <li>
                    • Usa <code>in</code> para verificar si el valor está en la
                    lista
                  </li>
                  <li>• Los valores se separan por comas en la URL</li>
                  <li>• Ideal para campos de tipo array o JSON</li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(multiselectFiltersConfig, 'Multiselect Filters')}
          </CardContent>
        </Card>

        {/* Filtros de Fecha */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Filtros de Fecha</CardTitle>
            </div>
            <CardDescription>
              Filtros para seleccionar fechas específicas con diferentes
              operadores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...dateFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(dateFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite filtrar registros por fechas específicas usando
                    diferentes operadores de comparación. Útil para filtrar por
                    fechas de creación, actualización, vencimiento, etc.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'date' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'eq' | 'gte' | 'lte' | 'gt' |
                      'lt' (requerido)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>
                      ?created_date=2024-01-15&updated_after=2024-01-01
                    </code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>
                      .eq('created_date', '2024-01-15').gte('updated_after',
                      '2024-01-01')
                    </code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Usa <code>eq</code> para fechas exactas
                  </li>
                  <li>
                    • Usa <code>gte</code>/<code>lte</code> para rangos
                    (mayor/menor o igual)
                  </li>
                  <li>
                    • Usa <code>gt</code>/<code>lt</code> para rangos estrictos
                    (mayor/menor)
                  </li>
                  <li>
                    • Las fechas se formatean automáticamente a ISO string
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(dateFiltersConfig, 'Date Filters')}
          </CardContent>
        </Card>

        {/* Filtros de Rango de Fechas */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <CardTitle>Filtros de Rango de Fechas</CardTitle>
            </div>
            <CardDescription>
              Filtros para seleccionar rangos de fechas (desde - hasta)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...dateRangeFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(dateRangeFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite seleccionar un rango de fechas (desde una fecha
                    hasta otra). Genera automáticamente dos filtros: uno para la
                    fecha inicial (gte) y otro para la fecha final (lte).
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'dateRange' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'gte' (base, se genera lte
                      automáticamente)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>?date_range=2024-01-01,2024-01-31</code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>
                      .gte('date_range', '2024-01-01').lte('date_range',
                      '2024-01-31')
                    </code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Genera automáticamente dos condiciones: gte (desde) y lte
                    (hasta)
                  </li>
                  <li>• Las fechas se separan por coma en la URL</li>
                  <li>• Útil para filtrar por períodos específicos</li>
                  <li>
                    • Incluye validación para que la fecha inicial sea menor que
                    la final
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(dateRangeFiltersConfig, 'Date Range Filters')}
          </CardContent>
        </Card>

        {/* Filtros Booleanos */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ToggleLeft className="h-5 w-5" />
              <CardTitle>Filtros Booleanos</CardTitle>
            </div>
            <CardDescription>
              Filtros para valores verdadero/falso con opciones Sí/No/Todos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...booleanFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(booleanFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite filtrar por campos booleanos con opciones claras: Sí
                    (true), No (false), o Todos (sin filtro). Ideal para campos
                    como activo/inactivo, público/privado, etc.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'boolean' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'eq' (requerido)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>?is_active=true&has_image=false</code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>.eq('is_active', true).eq('has_image', false)</code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Convierte automáticamente "true"/"false" a valores
                    booleanos
                  </li>
                  <li>
                    • Incluye opción "Todos" para mostrar todos los registros
                  </li>
                  <li>• Perfecto para campos de estado binario</li>
                  <li>
                    • Las etiquetas se muestran como "Sí" y "No" para mejor UX
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(booleanFiltersConfig, 'Boolean Filters')}
          </CardContent>
        </Card>

        {/* Filtros Numéricos */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              <CardTitle>Filtros Numéricos</CardTitle>
            </div>
            <CardDescription>
              Filtros para valores numéricos con operadores de comparación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...numberFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(numberFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Permite filtrar por valores numéricos usando operadores de
                    comparación. Útil para precios, cantidades, edades,
                    puntuaciones, etc.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Parámetros</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      <strong>key:</strong> Identificador único (requerido)
                    </li>
                    <li>
                      <strong>type:</strong> 'number' (requerido)
                    </li>
                    <li>
                      <strong>label:</strong> Etiqueta visible (requerido)
                    </li>
                    <li>
                      <strong>placeholder:</strong> Texto de ayuda (opcional)
                    </li>
                    <li>
                      <strong>operator:</strong> 'eq' | 'gte' | 'lte' | 'gt' |
                      'lt' (requerido)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>?min_price=100&max_quantity=50</code>
                  </p>
                  <p>
                    <strong>Supabase:</strong>{' '}
                    <code>.gte('min_price', 100).lte('max_quantity', 50)</code>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Convierte automáticamente strings a números</li>
                  <li>
                    • Usa <code>gte</code>/<code>lte</code> para rangos
                    mínimos/máximos
                  </li>
                  <li>
                    • Usa <code>eq</code> para valores exactos
                  </li>
                  <li>• Incluye validación de entrada numérica</li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(numberFiltersConfig, 'Number Filters')}
          </CardContent>
        </Card>

        {/* Filtros Combinados */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <CardTitle>Filtros Combinados</CardTitle>
            </div>
            <CardDescription>
              Ejemplo completo combinando múltiples tipos de filtros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo interactivo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Demo Interactivo</span>
              </div>
              <Filters {...combinedFiltersConfig} />
              <div>
                <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
                {renderAppliedFilters(combinedFilters)}
              </div>
            </div>

            <Separator />

            {/* Documentación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">📋 Documentación</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">🎯 Propósito</h4>
                  <p className="text-sm text-muted-foreground">
                    Demuestra cómo combinar diferentes tipos de filtros en una
                    sola configuración. Ejemplo práctico de un sistema de
                    filtros completo para productos.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">⚙️ Características</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Búsqueda de texto (search)</li>
                    <li>• Selección única (select)</li>
                    <li>• Selección múltiple (multiselect)</li>
                    <li>• Rango de fechas (dateRange)</li>
                    <li>• Filtro booleano (boolean)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">📤 Resultado Esperado</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  <p>
                    <strong>URL:</strong>{' '}
                    <code>
                      ?search_product=laptop&product_status=available&product_tags=new,sale&is_featured=true
                    </code>
                  </p>
                  <p>
                    <strong>Supabase:</strong> Múltiples condiciones combinadas
                    con AND
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Notas de Uso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Todos los filtros se combinan con operador AND</li>
                  <li>• Cada filtro es independiente y opcional</li>
                  <li>
                    • La URL se actualiza automáticamente con todos los valores
                  </li>
                  <li>
                    • Perfecto para páginas de listado con filtros avanzados
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            {renderCodeExample(combinedFiltersConfig, 'Combined Filters')}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            🔧 Integración con Supabase
          </h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Para usar los filtros con Supabase, utiliza el hook{' '}
              <code>useFilters</code> y su método{' '}
              <code>getSupabaseFilters()</code>:
            </p>

            <div className="bg-background p-4 rounded border">
              <pre className="text-sm overflow-x-auto">
                <code>{`// En tu componente de lista
const { getSupabaseFilters } = useFilters(filtersConfig)

// En tu query de Supabase
const { data, error } = await supabase
  .from('products')
  .select('*')
  .apply(getSupabaseFilters()) // Aplica todos los filtros automáticamente
  
// O manualmente:
const filters = getSupabaseFilters()
let query = supabase.from('products').select('*')

filters.forEach(filter => {
  query = query[filter.operator](filter.column, filter.value)
})

const { data, error } = await query`}</code>
              </pre>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium mb-2">✅ Ventajas</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Persistencia automática en URL</li>
                  <li>• Tipado completo con TypeScript</li>
                  <li>• Integración directa con Supabase</li>
                  <li>• Componentes reutilizables</li>
                  <li>• Responsive (mobile/desktop)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">🎯 Casos de Uso</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Listados de productos</li>
                  <li>• Tablas de usuarios</li>
                  <li>• Dashboards con datos</li>
                  <li>• Reportes filtrados</li>
                  <li>• Búsquedas avanzadas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

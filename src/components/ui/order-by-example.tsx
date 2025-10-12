'use client'

import React from 'react'
import { OrderBy, OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/hooks/use-order-by'
import type { OrderByConfig } from '@/types/order-by.types'

/**
 * Ejemplo de uso del componente OrderBy con soporte para tablas foráneas
 * 
 * Este ejemplo demuestra cómo usar el componente OrderBy para ordenar
 * tanto campos regulares como campos de tablas embebidas/foráneas.
 */
export function OrderByExample() {
  // Configuración con campos regulares y de tablas foráneas
  const orderByConfig: OrderByConfig = {
    columns: [
      // Campos regulares
      { field: 'name', label: 'Nombre del País' },
      { field: 'population', label: 'Población' },
      { field: 'created_at', label: 'Fecha de Creación' },
      
      // Campos de tablas foráneas (embebidas)
      { field: 'name', label: 'Nombre de Ciudad', foreignTable: 'cities' },
      { field: 'population', label: 'Población de Ciudad', foreignTable: 'cities' },
      { field: 'founded_at', label: 'Fecha de Fundación', foreignTable: 'cities' },
    ],
    multiSort: true, // Permitir ordenamiento múltiple
  }

  const orderByHook = useOrderBy(orderByConfig)

  // Manejar cambios en el ordenamiento
  const handleSortChange = (appliedSorts: any[]) => {
    console.log('Ordenamientos aplicados:', appliedSorts)
    
    // Ejemplo de cómo construir una consulta Supabase
    const supabaseOrders = appliedSorts.map(sort => ({
      column: sort.field,
      ascending: sort.ascending,
      ...(sort.foreignTable && { foreignTable: sort.foreignTable })
    }))
    
    console.log('Para Supabase:', supabaseOrders)
    
    // Ejemplo de uso en Supabase:
    // const { data } = await supabase
    //   .from('countries')
    //   .select('name, population, cities(name, population, founded_at)')
    //   .order('name', { ascending: true })
    //   .order('name', { foreignTable: 'cities', ascending: false })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">OrderBy con Tablas Foráneas</h2>
        <p className="text-muted-foreground mb-4">
          Este ejemplo muestra cómo usar el componente OrderBy para ordenar
          tanto campos regulares como campos de tablas embebidas.
        </p>
      </div>

      {/* Componente OrderBy */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Selector de Ordenamiento</h3>
        <OrderBy 
          config={orderByConfig} 
          onSortChange={handleSortChange}
        />
      </div>

      {/* Ejemplo de headers de tabla */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Headers de Tabla con Ordenamiento</h3>
        <div className="grid grid-cols-3 gap-4 p-2 border-b font-medium">
          <OrderByTableHeader
            field="name"
            label="País"
            orderByHook={orderByHook}
          />
          <OrderByTableHeader
            field="population"
            label="Población"
            orderByHook={orderByHook}
          />
          <OrderByTableHeader
            field="name"
            label="Ciudad"
            foreignTable="cities"
            orderByHook={orderByHook}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 p-2 text-sm">
          <div>España</div>
          <div>47,000,000</div>
          <div>Madrid</div>
        </div>
        <div className="grid grid-cols-3 gap-4 p-2 text-sm">
          <div>Francia</div>
          <div>67,000,000</div>
          <div>París</div>
        </div>
      </div>

      {/* Estado actual */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Estado Actual</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Ordenamientos actuales:</strong>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(orderByHook.currentSort, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Para Supabase:</strong>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify(orderByHook.appliedSorts, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Ejemplo de consulta Supabase */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Ejemplo de Consulta Supabase</h3>
        <pre className="text-xs bg-muted p-3 rounded overflow-auto">
{`const { data, error } = await supabase
  .from('countries')
  .select('name, population, cities(name, population, founded_at)')
  .order('name', { ascending: true })
  .order('name', { foreignTable: 'cities', ascending: false })`}
        </pre>
      </div>
    </div>
  )
}
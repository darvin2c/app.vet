'use client'

import React, { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { OrderBy } from '@/components/ui/order-by'
import { OrderByConfig } from '@/types/order-by.types'
import { useOrderBy } from '@/hooks/use-order-by'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TableHeaderSort } from '@/components/ui/table-header-sort'

// Datos de ejemplo
interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  status: 'active' | 'inactive'
}

const products: Product[] = [
  {
    id: '1',
    name: 'Vacuna Antirrábica',
    price: 45.99,
    category: 'Vacunas',
    stock: 120,
    status: 'active',
  },
  {
    id: '2',
    name: 'Shampoo Antipulgas',
    price: 18.50,
    category: 'Higiene',
    stock: 85,
    status: 'active',
  },
  {
    id: '3',
    name: 'Alimento Premium Gatos',
    price: 65.75,
    category: 'Alimentos',
    stock: 42,
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Collar Identificación',
    price: 12.99,
    category: 'Accesorios',
    stock: 200,
    status: 'active',
  },
  {
    id: '5',
    name: 'Vitaminas Caninas',
    price: 32.50,
    category: 'Suplementos',
    stock: 65,
    status: 'active',
  },
  {
    id: '6',
    name: 'Correa Retráctil',
    price: 28.75,
    category: 'Accesorios',
    stock: 150,
    status: 'active',
  },
  {
    id: '7',
    name: 'Medicamento Antiparasitario',
    price: 55.00,
    category: 'Medicamentos',
    stock: 30,
    status: 'active',
  },
  {
    id: '8',
    name: 'Juguete Interactivo',
    price: 22.99,
    category: 'Juguetes',
    stock: 95,
    status: 'inactive',
  },
]

// Configuración de ordenamiento simple
const simpleOrderByConfig: OrderByConfig = {
  columns: [
    { field: 'name', label: 'Nombre' },
    { field: 'price', label: 'Precio' },
    { field: 'category', label: 'Categoría' },
    { field: 'stock', label: 'Stock' },
  ],
  defaultSort: {
    field: 'name',
    direction: 'asc',
  },
}

// Configuración de ordenamiento múltiple
const multiOrderByConfig: OrderByConfig = {
  columns: [
    { field: 'name', label: 'Nombre' },
    { field: 'price', label: 'Precio' },
    { field: 'category', label: 'Categoría' },
    { field: 'stock', label: 'Stock' },
    { field: 'status', label: 'Estado' },
  ],
  multiSort: true,
  defaultSort: {
    field: 'category',
    direction: 'asc',
  },
}

export default function OrderByDemo() {
  // Hook para ordenamiento simple
  const simpleOrderBy = useOrderBy(simpleOrderByConfig)
  
  // Hook para ordenamiento múltiple
  const multiOrderBy = useOrderBy(multiOrderByConfig)

  // Estados para react-table
  const [simpleSorting, setSimpleSorting] = useState<SortingState>([])
  const [multiSorting, setMultiSorting] = useState<SortingState>([])

  // Sincronizar ordenamiento simple con react-table
  useEffect(() => {
    if (simpleOrderBy.appliedSorts.length > 0) {
      const sort = simpleOrderBy.appliedSorts[0]
      setSimpleSorting([
        {
          id: sort.field,
          desc: sort.direction === 'desc',
        },
      ])
    } else {
      setSimpleSorting([])
    }
  }, [simpleOrderBy.appliedSorts])

  // Sincronizar ordenamiento múltiple con react-table
  useEffect(() => {
    const sorting = multiOrderBy.appliedSorts.map((sort) => ({
      id: sort.field,
      desc: sort.direction === 'desc',
    }))
    setMultiSorting(sorting)
  }, [multiOrderBy.appliedSorts])

  // Definir columnas
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Nombre',
    },
    {
      accessorKey: 'price',
      header: 'Precio',
      cell: ({ row }) => (
        <div className="text-right">S/ {row.getValue('price')}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Categoría',
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <div className="text-right">{row.getValue('stock')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={row.getValue('status') === 'active' ? 'default' : 'secondary'}>
          {row.getValue('status') === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ]

  // Configurar tabla simple
  const simpleTable = useReactTable({
    data: products,
    columns,
    state: {
      sorting: simpleSorting,
    },
    onSortingChange: setSimpleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Configurar tabla múltiple
  const multiTable = useReactTable({
    data: products,
    columns,
    state: {
      sorting: multiSorting,
    },
    onSortingChange: setMultiSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Demo: Componente OrderBy</h1>
        <p className="text-muted-foreground text-lg">
          Este componente permite ordenar datos por diferentes campos y direcciones.
          Se integra con react-table y persiste el ordenamiento en la URL usando nuqs.
        </p>
      </div>

      {/* Ordenamiento Simple */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Ordenamiento Simple</CardTitle>
              <CardDescription>
                Lista simple de columnas. Haz clic para ordenar: Sin ordenar → ASC → DESC → Sin ordenar.
              </CardDescription>
            </div>
            <OrderBy config={simpleOrderByConfig} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Mostrar ordenamiento activo */}
          <div className="mb-4">
            {simpleOrderBy.currentSort.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ordenado por:</span>
                {simpleOrderBy.currentSort.map((sort) => (
                  <Badge key={sort.field} variant="secondary">
                    {simpleOrderByConfig.columns.find(col => col.field === sort.field)?.label} 
                    {sort.direction === 'asc' ? ' ↑' : ' ↓'}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {simpleTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <TableHeaderSort
                              header={header}
                              orderByHook={simpleOrderBy}
                              field={header.id}
                            />
                          </div>
                        )}
                      </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
              <TableBody>
                {simpleTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Ordenamiento Múltiple */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Ordenamiento Múltiple</CardTitle>
              <CardDescription>
                Permite ordenar por múltiples campos simultáneamente. Útil para ordenamientos complejos.
              </CardDescription>
            </div>
            <OrderBy config={multiOrderByConfig} />
          </div>
        </CardHeader>
        <CardContent>
          {/* Mostrar ordenamientos activos */}
          <div className="mb-4">
            {multiOrderBy.currentSort.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ordenado por:</span>
                {multiOrderBy.currentSort.map((sort, index) => (
                  <Badge key={sort.field} variant="secondary">
                    {index + 1}. {multiOrderByConfig.columns.find(col => col.field === sort.field)?.label} 
                    {sort.direction === 'asc' ? ' ↑' : ' ↓'}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {multiTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <TableHeaderSort
                              header={header}
                              orderByHook={multiOrderBy}
                              field={header.id}
                            />
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {multiTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Documentación y ejemplos de código */}
      <Card>
        <CardHeader>
          <CardTitle>Código de ejemplo</CardTitle>
          <CardDescription>
            Implementación básica del componente OrderBy con integración a react-table y Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Configuración */}
            <div>
              <h4 className="font-medium mb-2">1. Configuración del componente</h4>
              <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                {`const orderByConfig: OrderByConfig = {
  columns: [
    { field: 'name', label: 'Nombre' },
    { field: 'price', label: 'Precio' },
    { field: 'category', label: 'Categoría' },
    { field: 'stock', label: 'Stock' },
  ],
  defaultSort: {
    field: 'name',
    direction: 'asc',
  },
  multiSort: false, // true para ordenamiento múltiple
}`}
              </pre>
            </div>

            {/* Hook */}
            <div>
              <h4 className="font-medium mb-2">2. Uso del hook</h4>
              <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                {`const {
  currentSort,
  appliedSorts,
  setSort,
  clearSort,
  getSortDirection,
  isSorted,
} = useOrderBy(orderByConfig)`}
              </pre>
            </div>

            {/* React Table */}
            <div>
              <h4 className="font-medium mb-2">3. Integración con react-table</h4>
              <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                {`// Sincronizar con react-table
useEffect(() => {
  const sorting = appliedSorts.map((sort) => ({
    id: sort.field,
    desc: sort.direction === 'desc',
  }))
  setSorting(sorting)
}, [appliedSorts])

// Configurar tabla
const table = useReactTable({
  data: products,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})`}
              </pre>
            </div>

            {/* Supabase */}
            <div>
              <h4 className="font-medium mb-2">4. Integración con Supabase</h4>
              <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                {`// Aplicar ordenamiento a consulta Supabase
let query = supabase.from('products').select('*')

// Para ordenamiento simple
if (appliedSorts.length > 0) {
  const sort = appliedSorts[0]
  query = query.order(sort.field, { 
    ascending: sort.ascending 
  })
}

// Para ordenamiento múltiple
appliedSorts.forEach((sort) => {
  query = query.order(sort.field, { 
    ascending: sort.ascending 
  })
})

const { data } = await query`}
              </pre>
            </div>

            {/* Componente UI */}
            <div>
              <h4 className="font-medium mb-2">5. Uso en la interfaz</h4>
              <pre className="p-4 bg-muted rounded-md overflow-auto text-sm">
                {`// Componente principal
<OrderBy config={orderByConfig} />

// Mostrar ordenamiento activo
{currentSort.length > 0 && (
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Ordenado por:</span>
    {currentSort.map((sort) => (
      <Badge key={sort.field} variant="secondary">
        {config.columns.find(col => col.field === sort.field)?.label} 
        {sort.direction === 'asc' ? ' ↑' : ' ↓'}
      </Badge>
    ))}
  </div>
)}

// Con callback personalizado
<OrderBy 
  config={orderByConfig} 
  onSortChange={(sorts) => {
    console.log('Ordenamientos aplicados:', sorts)
  }}
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useMemo } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ProductRow = {
  name: string
  category: string
  unitsSold: number
  revenue: number
}

export function TopProductsTable({ rows }: { rows?: ProductRow[] }) {
  const data = rows || [
    {
      name: 'Antipulgas X',
      category: 'Farmacia',
      unitsSold: 85,
      revenue: 3420,
    },
    {
      name: 'Alimento Premium',
      category: 'Alimentos',
      unitsSold: 64,
      revenue: 5120,
    },
    {
      name: 'Collar ABC',
      category: 'Accesorios',
      unitsSold: 40,
      revenue: 1200,
    },
  ]

  const columns = useMemo<ColumnDef<ProductRow>[]>(
    () => [
      { accessorKey: 'name', header: 'Producto' },
      { accessorKey: 'category', header: 'Categoría' },
      {
        accessorKey: 'unitsSold',
        header: 'Unidades',
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.unitsSold}</Badge>
        ),
      },
      {
        accessorKey: 'revenue',
        header: 'Ingresos',
        cell: ({ row }) =>
          `S/. ${row.original.revenue.toLocaleString('es-PE')}`,
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Top productos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((r) => (
              <TableRow key={r.id}>
                {r.getVisibleCells().map((c) => (
                  <TableCell key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

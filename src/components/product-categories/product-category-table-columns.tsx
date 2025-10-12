'use client'

import { ColumnDef, Row } from '@tanstack/react-table'
import { Database } from '@/types/supabase.types'
import { ProductCategoryActions } from './product-category-actions'
import { IsActiveDisplay } from '@/components/ui/is-active-field'
import { OrderByTableHeader } from '@/components/ui/order-by'
import { useOrderBy } from '@/hooks/use-order-by'

type ProductCategory = Database['public']['Tables']['product_categories']['Row']

export function getProductCategoryColumns(
  orderByHook: ReturnType<typeof useOrderBy>
): ColumnDef<ProductCategory>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ header }) => (
        <OrderByTableHeader field="name" orderByHook={orderByHook}>
          Nombre
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductCategory> }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: ({ header }) => (
        <OrderByTableHeader field="description" orderByHook={orderByHook}>
          Descripción
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductCategory> }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('description') || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: ({ header }) => (
        <OrderByTableHeader field="is_active" orderByHook={orderByHook}>
          Estado
        </OrderByTableHeader>
      ),
      cell: ({ row }: { row: Row<ProductCategory> }) => (
        <IsActiveDisplay value={row.getValue('is_active')} />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: Row<ProductCategory> }) => (
        <ProductCategoryActions category={row.original} />
      ),
    },
  ]
}

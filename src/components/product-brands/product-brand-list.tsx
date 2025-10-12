'use client'

import useProductBrands from '@/hooks/product-brands/use-product-brand-list'
import { ProductBrandFilters } from '@/schemas/product-brands.schema'
import { Tables } from '@/types/supabase.types'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ProductBrandActions } from './product-brand-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ProductBrandListProps {
  filters?: ProductBrandFilters
}

export function ProductBrandList({ filters }: ProductBrandListProps) {
  const { data: productBrands, isLoading } = useProductBrands(filters)

  if (isLoading) {
    return <TableSkeleton />
  }

  if (!productBrands || productBrands.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay marcas de productos</EmptyTitle>
          <EmptyDescription>No se encontraron marcas de productos con los filtros aplicados.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4">
      {productBrands.map((brand) => (
        <Card key={brand.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                  {brand.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <ProductBrandActions brand={brand} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {brand.description && (
                <div>
                  <span className="font-medium text-muted-foreground">Descripción:</span>
                  <p className="mt-1">{brand.description}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-muted-foreground">Registrado:</span>
                <p className="mt-1">
                  {format(new Date(brand.created_at), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
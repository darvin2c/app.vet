'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import useSupplierBrands from '@/hooks/supplier-brands/use-supplier-brand-list'
import { SupplierBrandFilters } from '@/schemas/supplier-brands.schema'
import { SupplierBrandActions } from './supplier-brand-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SupplierBrandListProps {
  filters?: SupplierBrandFilters
}

export function SupplierBrandList({ filters }: SupplierBrandListProps) {
  const { data: supplierBrands, isLoading } = useSupplierBrands(filters)

  if (isLoading) {
    return <TableSkeleton />
  }

  if (!supplierBrands || supplierBrands.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay asignaciones de marcas</EmptyTitle>
          <EmptyDescription>
            No se encontraron asignaciones de marcas a proveedores con los
            filtros aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {supplierBrands.map((supplierBrand) => (
        <Card key={`${supplierBrand.supplier_id}-${supplierBrand.brand_id}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asignación de Marca
            </CardTitle>
            <SupplierBrandActions
              supplierId={supplierBrand.supplier_id}
              brandId={supplierBrand.brand_id}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Proveedor
                </p>
                <p className="text-sm">{supplierBrand.suppliers?.name}</p>
                {supplierBrand.suppliers?.contact_person && (
                  <p className="text-xs text-muted-foreground">
                    Contacto: {supplierBrand.suppliers.contact_person}
                  </p>
                )}
                <Badge
                  variant={
                    supplierBrand.suppliers?.is_active ? 'default' : 'secondary'
                  }
                >
                  {supplierBrand.suppliers?.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Marca
                </p>
                <p className="text-sm">{supplierBrand.product_brands?.name}</p>
                {supplierBrand.product_brands?.description && (
                  <p className="text-xs text-muted-foreground">
                    {supplierBrand.product_brands.description}
                  </p>
                )}
                <Badge
                  variant={
                    supplierBrand.product_brands?.is_active
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {supplierBrand.product_brands?.is_active
                    ? 'Activa'
                    : 'Inactiva'}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Asignado el{' '}
                  {format(new Date(supplierBrand.created_at), 'dd/MM/yyyy', {
                    locale: es,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

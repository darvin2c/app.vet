'use client'

import useSuppliers from '@/hooks/suppliers/use-supplier-list'
import { SupplierFilters } from '@/schemas/suppliers.schema'
import { Tables } from '@/types/supabase.types'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SupplierActions } from './supplier-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, Phone, Globe, MapPin } from 'lucide-react'

interface SupplierListProps {
  filters?: SupplierFilters
}

export function SupplierList({ filters }: SupplierListProps) {
  const { data: suppliers, isLoading } = useSuppliers(filters)

  if (isLoading) {
    return <TableSkeleton />
  }

  if (!suppliers || suppliers.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No hay proveedores</EmptyTitle>
          <EmptyDescription>No se encontraron proveedores con los filtros aplicados.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-4">
      {suppliers.map((supplier) => (
        <Card key={supplier.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                  {supplier.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <SupplierActions supplier={supplier} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {supplier.contact_person && (
                <div>
                  <span className="font-medium text-muted-foreground">Contacto:</span>
                  <p className="mt-1">{supplier.contact_person}</p>
                </div>
              )}
              
              {supplier.email && (
                <div>
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${supplier.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.email}
                    </a>
                  </div>
                </div>
              )}
              
              {supplier.phone && (
                <div>
                  <span className="font-medium text-muted-foreground">Teléfono:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${supplier.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {supplier.address && (
                <div>
                  <span className="font-medium text-muted-foreground">Dirección:</span>
                  <div className="mt-1 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>{supplier.address}</p>

                    </div>
                  </div>
                </div>
              )}
              
              {supplier.website && (
                <div>
                  <span className="font-medium text-muted-foreground">Sitio Web:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </div>
                </div>
              )}
              
              {supplier.document_number && (
                <div>
                  <span className="font-medium text-muted-foreground">Documento:</span>
                  <p className="mt-1">{supplier.document_number}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-muted-foreground">Registrado:</span>
                <p className="mt-1">
                  {format(new Date(supplier.created_at), 'dd/MM/yyyy', { locale: es })}
                </p>
              </div>
            </div>
            
            {supplier.notes && (
              <div className="mt-4 pt-4 border-t">
                <span className="font-medium text-muted-foreground">Notas:</span>
                <p className="mt-1 text-sm">{supplier.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
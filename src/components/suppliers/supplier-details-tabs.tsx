'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Database } from '@/types/supabase.types'
import SupplierBrandsSection from './supplier-brands-section'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface SupplierDetailsTabsProps {
  supplier: Supplier
}

export default function SupplierDetailsTabs({
  supplier,
}: SupplierDetailsTabsProps) {
  return (
    <Tabs defaultValue="information" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="information">Información</TabsTrigger>
        <TabsTrigger value="brands">Marcas</TabsTrigger>
      </TabsList>

      <TabsContent value="information" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nombre</h3>
              <p className="text-base text-gray-900">{supplier.name}</p>
            </div>

            {supplier.contact_person && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Persona de contacto
                </h3>
                <p className="text-base text-gray-900">
                  {supplier.contact_person}
                </p>
              </div>
            )}

            {supplier.email && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-base text-gray-900">{supplier.email}</p>
              </div>
            )}

            {supplier.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
                <p className="text-base text-gray-900">{supplier.phone}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {supplier.address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                <p className="text-base text-gray-900">{supplier.address}</p>
              </div>
            )}

            {supplier.website && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Sitio web</h3>
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-blue-600 hover:text-blue-800 underline"
                >
                  {supplier.website}
                </a>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Estado</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  supplier.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {supplier.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            {supplier.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notas</h3>
                <p className="text-base text-gray-900 whitespace-pre-wrap">
                  {supplier.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="brands" className="space-y-6">
        <SupplierBrandsSection supplierId={supplier.id} />
      </TabsContent>
    </Tabs>
  )
}

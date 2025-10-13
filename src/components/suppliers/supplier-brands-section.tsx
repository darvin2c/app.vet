'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import { SupplierBrandList } from '@/components/supplier-brands/supplier-brand-list'
import { SupplierBrandCreate } from '@/components/supplier-brands/supplier-brand-create'

interface SupplierBrandsSectionProps {
  supplierId: string
}

export default function SupplierBrandsSection({
  supplierId,
}: SupplierBrandsSectionProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Marcas del Proveedor
          </h3>
          <p className="text-sm text-gray-600">
            Gestiona las marcas asignadas a este proveedor
          </p>
        </div>
        <ResponsiveButton
          icon={Plus}
          onClick={() => setIsCreateOpen(true)}
          tooltip="Asignar nueva marca"
        >
          Asignar Marca
        </ResponsiveButton>
      </div>

      <SupplierBrandList
        filters={{
          supplier_id: supplierId,
        }}
      />

      <SupplierBrandCreate
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        supplierId={supplierId}
      />
    </div>
  )
}

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ResponsiveButton } from '@/components/ui/responsive-button'
import useSuppliersNavigation from '@/hooks/suppliers/use-suppliers-navigation'
import { useRouter } from 'next/navigation'
import { Database } from '@/types/supabase.types'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface SupplierDetailsHeaderProps {
  supplier: Supplier
}

export default function SupplierDetailsHeader({
  supplier,
}: SupplierDetailsHeaderProps) {
  const router = useRouter()
  const { previous, next, currentIndex, total, isLoading } =
    useSuppliersNavigation(supplier.id)

  const handlePrevious = () => {
    if (previous) {
      router.push(`/suppliers/${previous.id}`)
    }
  }

  const handleNext = () => {
    if (next) {
      router.push(`/suppliers/${next.id}`)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
        {supplier.contact_person && (
          <p className="text-sm text-gray-600">
            Contacto: {supplier.contact_person}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isLoading && total > 1 && (
          <>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} de {total}
            </span>
            <ResponsiveButton
              icon={ChevronLeft}
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!previous}
              tooltip="Proveedor anterior"
            />
            <ResponsiveButton
              icon={ChevronRight}
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!next}
              tooltip="Siguiente proveedor"
            />
          </>
        )}
      </div>
    </div>
  )
}

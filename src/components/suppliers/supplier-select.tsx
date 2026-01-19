'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useSuppliers from '@/hooks/suppliers/use-supplier-list'
import { SupplierCreate } from './supplier-create'
import { SupplierEdit } from './supplier-edit'
import { Database } from '@/types/supabase.types'
import { Building } from 'lucide-react'

type Supplier = Database['public']['Tables']['suppliers']['Row']

interface SupplierSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function SupplierSelect({
  value,
  onValueChange,
  disabled,
  className,
  placeholder = 'Seleccionar proveedor...',
}: SupplierSelectProps) {
  const {
    suppliers,
    isLoading,
    searchTerm,
    setSearchTerm,
    appliedPagination,
  } = useSuppliers()

  return (
    <EntitySelect<Supplier>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={suppliers}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <SupplierCreate {...props} />}
      renderEdit={(props) => <SupplierEdit {...props} />}
      renderItem={(supplier) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{supplier.name}</span>
            {supplier.contact_person && (
              <span className="text-sm text-muted-foreground">
                Contacto: {supplier.contact_person}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(supplier) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{supplier.name}</span>
            {supplier.contact_person && (
              <span className="text-xs text-muted-foreground">
                ({supplier.contact_person})
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}

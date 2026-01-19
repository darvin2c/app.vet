'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useCustomerList from '@/hooks/customers/use-customer-list'
import { CustomerCreate } from './customer-create'
import { CustomerEdit } from './customer-edit'
import { Tables } from '@/types/supabase.types'
import { User } from 'lucide-react'
import { useState } from 'react'

type Customer = Tables<'customers'>

interface CustomerSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CustomerSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar cliente...',
  disabled = false,
  className,
}: CustomerSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useCustomerList({
    search: searchTerm,
  })
  const customers = data?.data || []

  return (
    <EntitySelect<Customer>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={customers}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderCreate={(props) => <CustomerCreate {...props} />}
      renderEdit={(props) => (
        <CustomerEdit {...props} customerId={props.id || ''} />
      )}
      renderItem={(customer) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm">
              {customer.first_name} {customer.last_name}
            </span>
            {customer.email && (
              <span className="text-sm text-muted-foreground">
                {customer.email}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(customer) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm">
              {customer.first_name} {customer.last_name}
            </span>
            {customer.email && (
              <span className="text-xs text-muted-foreground">
                ({customer.email})
              </span>
            )}
          </div>
        </div>
      )}
    />
  )
}

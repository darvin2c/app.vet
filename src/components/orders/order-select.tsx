'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import useOrderList from '@/hooks/orders/use-order-list'
import { Tables } from '@/types/supabase.types'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

type Order = Tables<'orders'>

interface OrderSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function OrderSelect({
  value,
  onValueChange,
  disabled,
  className,
  placeholder = 'Seleccionar orden...',
}: OrderSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useOrderList({
    search: searchTerm,
  })
  const orders = data?.data || []

  return (
    <EntitySelect<Order>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={orders}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderItem={(order) => (
        <div className="flex items-center gap-2 w-full">
          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">
                Orden #{order.order_number}
              </span>
              <Badge variant="outline" className="text-xs shrink-0">
                {order.status}
              </Badge>
            </div>
            {order.total && (
              <span className="text-sm text-muted-foreground">
                ${order.total.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}
      renderSelected={(order) => (
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <span className="font-medium">Orden #{order.order_number}</span>
            <Badge variant="outline" className="text-xs">
              {order.status}
            </Badge>
          </div>
        </div>
      )}
    />
  )
}

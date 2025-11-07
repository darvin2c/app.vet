'use client'

import { useState } from 'react'
import { ShoppingCart, Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/supabase.types'
import useOrderList from '@/hooks/orders/use-order-list'

type Order = Tables<'orders'>

interface OrderSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const orderStatusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
} as const

const orderStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
} as const

export function OrderSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar orden...',
  disabled = false,
  className,
}: OrderSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: orders = [], isLoading } = useOrderList({
    search: searchTerm,
    filters: [],
    orders: [{ field: 'created_at', direction: 'desc' }],
  })

  const selectedOrder = orders.find((order: Order) => order.id === value)

  const handleSelect = (orderId: string) => {
    if (!onValueChange) return
    onValueChange(value === orderId ? '' : orderId)
    setOpen(false)
  }

  return (
    <InputGroup className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <InputGroupButton
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between h-full px-3 py-2 text-left font-normal"
            disabled={disabled}
          >
            {selectedOrder ? (
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span>
                  {selectedOrder.order_number ||
                    `Orden #${selectedOrder.id.slice(0, 8)}`}
                </span>
                <Badge
                  className={
                    orderStatusColors[
                      selectedOrder.status as keyof typeof orderStatusColors
                    ]
                  }
                >
                  {
                    orderStatusLabels[
                      selectedOrder.status as keyof typeof orderStatusLabels
                    ]
                  }
                </Badge>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </InputGroupButton>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Buscar orden..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandEmpty>No se encontraron órdenes.</CommandEmpty>
            <CommandGroup>
              {orders.map((order: Order) => (
                <CommandItem
                  key={order.id}
                  value={order.id}
                  onSelect={() => handleSelect(order.id)}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {order.order_number || `Orden #${order.id.slice(0, 8)}`}
                    </span>
                    <Badge
                      className={
                        orderStatusColors[
                          order.status as keyof typeof orderStatusColors
                        ]
                      }
                    >
                      {
                        orderStatusLabels[
                          order.status as keyof typeof orderStatusLabels
                        ]
                      }
                    </Badge>
                  </div>
                  {value === order.id ? (
                    <Check className="ml-auto h-4 w-4" />
                  ) : (
                    <X className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </InputGroup>
  )
}

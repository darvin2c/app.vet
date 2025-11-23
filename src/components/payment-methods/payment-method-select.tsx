'use client'

import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
import { InputGroup, InputGroupButton } from '@/components/ui/input-group'
import { usePagination } from '@/components/ui/pagination/use-pagination'
import { usePaymentType } from '@/hooks/payment-methods/use-payment-type'
import { CreditCard, Check, ChevronsUpDown, X } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '../ui/spinner'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '../ui/empty'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type PaymentMethod = Tables<'payment_methods'>

interface PaymentMethodSelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PaymentMethodSelect({
  value,
  onValueChange,
  placeholder = 'Seleccionar método de pago...',
  disabled = false,
  className,
}: PaymentMethodSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { appliedPagination } = usePagination()
  const { getPaymentType } = usePaymentType()

  const { data, isLoading } = usePaymentMethodList({
    search: searchTerm,
    pagination: appliedPagination,
  })

  const paymentMethodsList: PaymentMethod[] = data?.data ?? []

  const filteredMethods = paymentMethodsList.filter((method) =>
    `${method.name}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedMethod = paymentMethodsList.find(
    (method) => method.id === value
  )

  const handleSelect = (methodId: string) => {
    if (!onValueChange) return
    onValueChange(value === methodId ? '' : methodId)
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
            {selectedMethod ? (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>{selectedMethod.name}</span>
                <Badge
                  className={
                    getPaymentType(selectedMethod.payment_type)?.badgeClass ??
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {getPaymentType(selectedMethod.payment_type)?.label ??
                    'Otros'}
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
              placeholder="Buscar método de pago..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? <div className="min-h-[100px]"><Spinner /></div> :
                  <>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia>
                          <CreditCard className="w-10 h-10 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyTitle>No se encontraron métodos de pago</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </>
                }
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {filteredMethods.map((method) => (
                  <CommandItem
                    key={method.id}
                    value={`${method.name}`}
                    onSelect={() => handleSelect(method.id)}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{method.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              getPaymentType(method.payment_type)?.badgeClass ??
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {getPaymentType(method.payment_type)?.label ??
                              'Otros'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === method.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedMethod && (
        <InputGroupButton
          variant="ghost"
          onClick={() => onValueChange?.('')}
          disabled={disabled}
          aria-label="Limpiar selección"
          className="h-full"
        >
          <X className="h-4 w-4" />
        </InputGroupButton>
      )}
    </InputGroup>
  )
}

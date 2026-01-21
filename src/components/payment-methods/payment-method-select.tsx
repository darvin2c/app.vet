'use client'

import { EntitySelect } from '@/components/ui/entity-select'
import { usePaymentMethodList } from '@/hooks/payment-methods/use-payment-method-list'
import { usePaymentType } from '@/hooks/payment-methods/use-payment-type'
import { Tables } from '@/types/supabase.types'
import { Badge } from '@/components/ui/badge'
import { CreditCard } from 'lucide-react'
import { useState } from 'react'

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
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = usePaymentMethodList({
    search: searchTerm,
  })
  const { getPaymentType } = usePaymentType()

  const paymentMethods = data?.data || []

  return (
    <EntitySelect<PaymentMethod>
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      items={paymentMethods}
      isPending={isLoading}
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      renderItem={(method) => {
        const typeInfo = getPaymentType(method.payment_type)
        return (
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span>{method.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {typeInfo?.label ?? 'Otros'}
                </span>
              </div>
            </div>
          </div>
        )
      }}
      renderSelected={(method) => {
        const typeInfo = getPaymentType(method.payment_type)
        return (
          <div className="flex items-center gap-2">
            {typeInfo?.icon && (
              <typeInfo.icon className="w-4 h-4 text-muted-foreground" />
            )}
            <span>{method.name}</span>
            {typeInfo?.label && (
              <span className="text-xs text-muted-foreground">
                ({typeInfo?.label ?? 'Otros'})
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

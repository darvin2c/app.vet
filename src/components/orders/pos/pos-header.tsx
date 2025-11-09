'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  X,
  ShoppingCart,
  Grid3X3,
  CreditCard,
  Receipt,
  SearchIcon,
} from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCustomerSelector } from './pos-customer-selector'
import { SearchInput } from '@/components/ui/search-input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ButtonGroup } from '@/components/ui/button-group'

interface POSHeaderProps {
  onClose?: () => void
}

export function POSHeader({ onClose }: POSHeaderProps) {
  const {
    orderItems,
    orderItemCount,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    enableReceiptTab,
    enablePaymentTab,
    setOpenCartMobile,
  } = usePOSStore()

  const tabs = [
    {
      value: 'catalog',
      label: 'Catálogo',
      icon: Grid3X3,
    },
    {
      value: 'payment',
      label: 'Pago',
      icon: CreditCard,
      disabled: !enablePaymentTab,
    },
    {
      value: 'receipt',
      label: 'Recibo',
      icon: Receipt,
      disabled: !enableReceiptTab, // Se habilita después del pago
    },
  ]

  return (
    <div className="flex flex-col gap-2 border-b pt-4">
      <div className="flex items-center  px-4 gap-6">
        {/* Left: Close button */}
        <div className="flex items-center gap-3">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">POS</h1>
        </div>
        <div className="w-full !max-w-2xl ">
          <InputGroup className="h-12">
            <InputGroupAddon align={'inline-start'}>
              <SearchIcon className="h-8 w-8" />
            </InputGroupAddon>
            <InputGroupInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full"
              placeholder="Buscar productos por nombre, SKU..."
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {/* Customer selector */}
            <InputGroupAddon align={'inline-end'} className="p-0">
              <ButtonGroup>
                <POSCustomerSelector />
                {/* Mobile cart button */}
                <Button
                  variant="outline"
                  className="lg:hidden h-auto"
                  onClick={() => setOpenCartMobile(true)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  <Badge variant="secondary" className="ml-1">
                    {orderItemCount()}
                  </Badge>
                </Button>
              </ButtonGroup>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      {/* Navigation tabs */}
      <div className="px-4 pb-4">
        <Tabs
          value={currentView}
          onValueChange={(value) => setCurrentView(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  disabled={tab.disabled}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, ShoppingCart, Grid3X3, CreditCard, Receipt } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCustomerSelector } from './pos-customer-selector'
import { SearchInput } from '@/components/ui/search-input'

interface POSHeaderProps {
  onClose?: () => void
}

export function POSHeader({ onClose }: POSHeaderProps) {
  const { cartItems, currentView, setCurrentView, setIsMobileCartOpen } =
    usePOSStore()

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

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
      disabled: cartItems.length === 0,
    },
    {
      value: 'receipt',
      label: 'Recibo',
      icon: Receipt,
      disabled: true, // Se habilita después del pago
    },
  ]

  return (
    <div className="border-b bg-white">
      <div className="flex items-center justify-between p-4">
        {/* Left: Close button */}
        <div className="flex items-center gap-3">
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">Punto de Venta</h1>
        </div>
        <div className="w-full !max-w-2xl">
          <SearchInput
            size="lg"
            placeholder="Buscar productos por nombre, SKU..."
          />
        </div>

        {/* Right: Customer selector and cart */}
        <div className="flex items-center gap-3">
          {/* Customer selector */}
          <POSCustomerSelector />

          {/* Mobile cart button */}
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <Badge variant="secondary" className="ml-1">
              {itemCount}
            </Badge>
          </Button>
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

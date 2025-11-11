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
    orderItemCount,
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setOpenCartMobile,
    enableReceiptTab,
    enablePaymentTab,
  } = usePOSStore()

  return (
    <div className="flex flex-col gap-2 border-b pt-4">
      <div className="flex items-center  px-4 gap-6">
        <h1 className="text-lg font-semibold hidden lg:inline-block">POS</h1>
        <div className="w-full !max-w-2xl pr-8">
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
                  variant="ghost"
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
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Catálogo</span>
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="flex items-center gap-2"
              disabled={!enablePaymentTab()}
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pago</span>
            </TabsTrigger>
            <TabsTrigger
              value="receipt"
              className="flex items-center gap-2"
              disabled={!enableReceiptTab()}
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Recibo</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

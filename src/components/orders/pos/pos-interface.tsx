'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart,
  Menu,
  X,
  ArrowLeft,
  User,
  PawPrint,
  Grid3X3,
  List,
  CreditCard,
} from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSProductGrid } from './pos-product-grid'
import { POSCart } from './pos-cart'
import { POSCustomerSelector } from './pos-customer-selector'
import { POSPayment } from './pos-payment'

type POSView = 'catalog' | 'cart' | 'payment' | 'receipt'

interface POSInterfaceProps {
  onOrderCreated?: () => void
  onClose?: () => void
}

export function POSInterface({ onOrderCreated, onClose }: POSInterfaceProps) {
  const [currentView, setCurrentView] = useState<POSView>('catalog')
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false)
  const { cartItems, selectedCustomer, selectedPet, cartTotal } = usePOSStore()

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-2 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl font-semibold">POS Veterinario</h1>
          <Badge
            variant="secondary"
            className="text-xs sm:text-sm hidden sm:inline-flex"
          >
            Touch Optimized
          </Badge>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {selectedCustomer && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs sm:text-sm max-w-[120px] sm:max-w-none truncate"
            >
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{selectedCustomer.first_name} {selectedCustomer.last_name}</span>
            </Badge>
          )}
          {selectedPet && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate"
            >
              <PawPrint className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{selectedPet.name}</span>
            </Badge>
          )}

          {/* Close Button */}
          {onClose && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="min-h-[40px] min-w-[40px]"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Cart Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileCartOpen(true)}
            className="lg:hidden min-h-[40px] min-w-[40px] relative"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Product Catalog */}
        <div className="flex-1 p-2 sm:p-4">
          <Card className="h-full">
            <div className="p-3 sm:p-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <h2 className="text-base sm:text-lg font-medium">
                  Catálogo de Productos
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant={currentView === 'catalog' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView('catalog')}
                    className="min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px]"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px]"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <POSCustomerSelector />
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 sm:p-4">
                {currentView === 'catalog' && <POSProductGrid />}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Panel - Cart & Actions (Desktop) */}
        <div className="hidden lg:block w-80 xl:w-96 p-4 pl-0">
          <Card className="h-full flex flex-col">
            {/* Cart Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito
                </h3>
                <Badge variant="secondary">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </Badge>
              </div>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-hidden">
              <POSCart />
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>S/ {cartTotal.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setCurrentView('cart')}
                    className="min-h-[48px] flex items-center gap-2"
                    disabled={itemCount === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ver Carrito
                  </Button>

                  <Button
                    size="lg"
                    onClick={() => setCurrentView('payment')}
                    className="min-h-[48px] flex items-center gap-2"
                    disabled={itemCount === 0 || !selectedCustomer}
                  >
                    <CreditCard className="h-4 w-4" />
                    Pagar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Mobile Bottom Bar */}
        <div className="lg:hidden bg-white border-t p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
            <div className="text-lg font-semibold">
              S/ {cartTotal.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsMobileCartOpen(true)}
              className="min-h-[48px] flex items-center gap-2"
              disabled={itemCount === 0}
            >
              <ShoppingCart className="h-4 w-4" />
              Ver Carrito
            </Button>

            <Button
              onClick={() => setCurrentView('payment')}
              className="min-h-[48px] flex items-center gap-2"
              disabled={itemCount === 0 || !selectedCustomer}
            >
              <CreditCard className="h-4 w-4" />
              Pagar
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Cart Drawer */}
      {isMobileCartOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileCartOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileCartOpen(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                <POSCart />
              </div>

              <div className="p-4 border-t bg-gray-50">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>S/ {cartTotal.toFixed(2)}</span>
                  </div>

                  <Button
                    size="lg"
                    onClick={() => {
                      setIsMobileCartOpen(false)
                      setCurrentView('payment')
                    }}
                    className="w-full min-h-[48px] flex items-center gap-2"
                    disabled={itemCount === 0 || !selectedCustomer}
                  >
                    <CreditCard className="h-4 w-4" />
                    Proceder al Pago
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {currentView === 'payment' && (
        <div className="fixed inset-0 z-50 bg-white">
          <POSPayment
            onOrderCreated={onOrderCreated}
            onClose={() => setCurrentView('catalog')}
          />
        </div>
      )}
    </div>
  )
}

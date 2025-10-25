'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, CreditCard, Trash } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCart } from './pos-cart'

export function POSCartSection() {
  const {
    cartItems,
    cartTotal,
    selectedCustomer,
    setCurrentView,
    setIsMobileCartOpen,
    clearCart,
  } = usePOSStore()

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      {/* Desktop Cart Panel */}
      <div className="hidden lg:block w-80 xl:w-96 border border-gray-200 bg-white">
        <div className="h-full flex flex-col">
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
              {itemCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => clearCart()}>
                  <Trash className="h-4 w-4" />
                  Limpiar
                </Button>
              )}
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

              <Button
                size="lg"
                onClick={() => setCurrentView('payment')}
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

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden bg-white border-t p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </div>
          <div className="text-lg font-semibold">S/ {cartTotal.toFixed(2)}</div>
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
    </>
  )
}

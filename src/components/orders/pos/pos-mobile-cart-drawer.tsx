'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, CreditCard } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCart } from './pos-cart'

export function POSMobileCartDrawer() {
  const {
    cartItems,
    cartTotal,
    selectedCustomer,
    isMobileCartOpen,
    setCurrentView,
    setIsMobileCartOpen,
  } = usePOSStore()

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (!isMobileCartOpen) return null

  return (
    <div
      className="lg:hidden fixed inset-0 z-50 bg-black/50"
      onClick={() => setIsMobileCartOpen(false)}
    >
      <div
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
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

          {/* Cart Content */}
          <div className="flex-1 overflow-hidden">
            <POSCart />
          </div>

          {/* Footer */}
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
  )
}

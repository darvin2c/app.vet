'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, CreditCard, Trash } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCart } from './pos-cart'
import { cn } from '@/lib/utils'

interface POSCartSectionProps {
  className?: string
}

export function POSCartSection({ className }: POSCartSectionProps) {
  const { cartItems, cartTotal, selectedCustomer, setCurrentView, clearCart } =
    usePOSStore()

  const handleProceedToPayment = () => {
    setCurrentView('payment')
  }

  const handleClearCart = () => {
    clearCart()
  }

  return (
    <div
      className={cn(
        'flex flex-col w-full lg:w-96 border-l bg-muted/30',
        className
      )}
    >
      {/* Cart Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold">Carrito</h2>
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cartItems.length}
              </Badge>
            )}
          </div>
          {cartItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 overflow-hidden">
        <POSCart />
      </div>

      {/* Cart Footer */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t bg-background space-y-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente</label>
            <div className="text-sm text-muted-foreground">
              {selectedCustomer
                ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                : 'Cliente general'}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>S/ {(cartTotal / 1.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IGV (18%):</span>
              <span>S/ {(cartTotal - cartTotal / 1.18).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>S/ {cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed Button */}
          <Button
            onClick={handleProceedToPayment}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Procesar Pago
          </Button>
        </div>
      )}
    </div>
  )
}

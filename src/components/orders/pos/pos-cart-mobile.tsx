'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ShoppingCart } from 'lucide-react'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCart } from './pos-cart'

export function POSCartMobile() {
  const {
    cartItems,
    isMobileCartOpen,
    setIsMobileCartOpen,
  } = usePOSStore()

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="lg:hidden">
      <Sheet open={isMobileCartOpen} onOpenChange={setIsMobileCartOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-40"
            onClick={() => setIsMobileCartOpen(true)}
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <POSCart 
            className="h-full border-0 bg-background"
            showHeader={true}
            showFooter={true}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

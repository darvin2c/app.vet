'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { usePOSStore } from '@/hooks/pos/use-pos-store'
import { POSCart } from './pos-cart'

export function POSCartMobile() {
  const { openCartMobile, setOpenCartMobile } = usePOSStore()

  return (
    <div className="lg:hidden">
      <Sheet open={openCartMobile} onOpenChange={setOpenCartMobile}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Carrito de Compras</SheetTitle>
          </SheetHeader>
          <POSCart className="h-full border-0 bg-background" />
        </SheetContent>
      </Sheet>
    </div>
  )
}

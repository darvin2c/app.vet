'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { PosPaymentMethodSelector } from './pos-payment-method-selector'
import { useState } from 'react'

export function PosPaymentMethodSelectorButton() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pago
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-6 pb-6">
          <PosPaymentMethodSelector onPaymentAdded={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

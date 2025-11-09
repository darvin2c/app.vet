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
import { FormProvider, UseFormReturn } from 'react-hook-form'
import { POSPaymentSchema } from '@/schemas/pos-payment.schema'
import { PosPaymentSelectorContent } from './pos-payment-method-selector'



export function PosPaymentMethodSelectorButton() {

const [open, setOpen] = useState(false) 

  return (
    <Sheet >
      <SheetTrigger asChild>
        <Button className="w-full h-12" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Pago
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader className="pb-4">
          <SheetTitle>Agregar Pago</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto">
            <PosPaymentSelectorContent onPaymentAdded={handlePaymentAdded} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

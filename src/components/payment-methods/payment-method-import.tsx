'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataImport } from '@/components/ui/data-import'
import { usePaymentMethodCreateBulk } from '@/hooks/payment-methods/use-payment-method-create-bulk'
import { toast } from 'sonner'
import {
  PaymentMethodCreateSchema,
  paymentMethodImportSchema,
} from '@/schemas/payment-methods.schema'

interface PaymentMethodImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentMethodImport({
  open,
  onOpenChange,
}: PaymentMethodImportProps) {
  const createPaymentMethodBulk = usePaymentMethodCreateBulk()

  const handleImport = async (data: PaymentMethodCreateSchema[]) => {
    try {
      await createPaymentMethodBulk.mutateAsync(data)
      toast.success('Métodos de pago importados exitosamente')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al importar métodos de pago:', error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Métodos de Pago</SheetTitle>
          <SheetDescription>
            Importa métodos de pago desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={paymentMethodImportSchema}
            onImport={handleImport}
            isLoading={createPaymentMethodBulk.isPending}
            templateName="metodos_pago_template.csv"
            error={createPaymentMethodBulk.error?.message}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

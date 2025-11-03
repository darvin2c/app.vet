'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DataImport } from '@/components/ui/data-import'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  CreatePaymentData,
  CreatePaymentSchema,
} from '@/schemas/payments.schema'
import usePaymentCreate from '@/hooks/payments/use-payment-create'

interface PaymentImportProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentImport({ open, onOpenChange }: PaymentImportProps) {
  const createPayment = usePaymentCreate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImport = async (data: CreatePaymentData[]) => {
    try {
      setIsLoading(true)
      setError(null)

      // Procesar los pagos uno por uno para manejar errores individuales
      const results = []
      for (const payment of data) {
        try {
          const result = await createPayment.mutateAsync(payment)
          results.push(result)
        } catch (err) {
          console.error('Error al crear pago:', err)
          throw new Error(`Error al procesar pago: ${err}`)
        }
      }

      toast.success(`${results.length} pagos importados exitosamente`)
      onOpenChange(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
      toast.error('Error al importar pagos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>Importar Pagos</SheetTitle>
          <SheetDescription>
            Importa pagos desde un archivo CSV o Excel.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6">
          <DataImport
            schema={CreatePaymentSchema}
            onImport={handleImport}
            isLoading={isLoading}
            templateName="pagos_template.csv"
            title="Importar Pagos"
            description="Importa pagos desde un archivo CSV o Excel. Los campos requeridos son: amount, payment_method_id, payment_date."
            error={error}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
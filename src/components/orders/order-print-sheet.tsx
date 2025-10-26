'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Printer, Eye } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { OrderPrint } from './order-print'

interface OrderPrintSheetProps {
  order: Tables<'orders'>
  trigger?: React.ReactNode
}

export function OrderPrintSheet({ order, trigger }: OrderPrintSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePrint = () => {
    setIsLoading(true)
    try {
      // Crear una nueva ventana para la impresión
      const printWindow = window.open('', '_blank')
      if (!printWindow) return

      // Obtener el contenido del componente OrderPrint
      const printContent = document.getElementById('order-print-content')
      if (!printContent) return

      // Escribir el contenido HTML completo con estilos de impresión
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Orden ${order.order_number}</title>
            <meta charset="utf-8">
            <style>
              @media print {
                @page {
                  margin: 0.5in;
                  size: A4;
                }
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #000;
              }
              .print-container {
                max-width: 210mm;
                margin: 0 auto;
                padding: 20px;
                background: white;
              }
              .no-print {
                display: none !important;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error('Error al imprimir:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // Abrir una nueva ventana con el contenido de impresión
    const previewWindow = window.open('', '_blank')
    if (!previewWindow) return

    const printContent = document.getElementById('order-print-content')
    if (!printContent) return

    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vista Previa - Orden ${order.order_number}</title>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: #f5f5f5;
            }
            .preview-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20px;
              background: white;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              border-radius: 8px;
            }
            .preview-header {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px 8px 0 0;
              border-bottom: 1px solid #dee2e6;
              margin: -20px -20px 20px -20px;
            }
            .preview-title {
              margin: 0;
              font-size: 18px;
              color: #495057;
            }
          </style>
        </head>
        <body>
          <div class="preview-container">
            <div class="preview-header">
              <h1 class="preview-title">Vista Previa - Orden ${order.order_number}</h1>
            </div>
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `)
    previewWindow.document.close()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full max-w-4xl">
        <SheetHeader>
          <SheetTitle>Imprimir Orden #{order.order_number}</SheetTitle>
          <SheetDescription>
            Vista previa del documento de la orden antes de imprimir
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <Button onClick={handlePreview} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button onClick={handlePrint} disabled={isLoading}>
              <Printer className="h-4 w-4 mr-2" />
              {isLoading ? 'Imprimiendo...' : 'Imprimir'}
            </Button>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <div id="order-print-content">
              <OrderPrint order={order} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

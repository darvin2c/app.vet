'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Printer, Eye, Download, FileText, Receipt } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { OrderPrint } from './order-print'
import { downloadPDF } from '@/lib/print-utils'

interface OrderPrintSheetProps {
  order: Tables<'orders'>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function OrderPrintSheet({
  order,
  trigger,
  open,
  onOpenChange,
}: OrderPrintSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [view, setView] = useState<'full' | 'ticket'>('full')

  // Usar el estado controlado si se proporciona, sino usar el estado interno
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

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

  const handleDownloadPDF = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    try {
      await downloadPDF('order-print-content', {
        filename: `orden-${order.order_number || order.id}.pdf`,
        format: 'a4',
        orientation: 'portrait',
      })
    } catch (error) {
      console.error('Error al descargar PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-4xl">
        <SheetHeader>
          <SheetTitle>Imprimir Orden #{order.order_number}</SheetTitle>
          <SheetDescription>
            Vista previa del documento de la orden antes de imprimir
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Formato:</span>
              <Select
                value={view}
                onValueChange={(value: 'full' | 'ticket') => setView(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Página Completa
                    </div>
                  </SelectItem>
                  <SelectItem value="ticket">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Ticket
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePreview} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Vista Previa
              </Button>
              <Button onClick={handlePrint} disabled={isLoading}>
                <Printer className="h-4 w-4 mr-2" />
                {isLoading ? 'Imprimiendo...' : 'Imprimir'}
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Descargando...' : 'Descargar PDF'}
              </Button>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-white">
            <div id="order-print-content">
              <OrderPrint orderId={order.id} view={view} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

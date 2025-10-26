'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  Printer,
  File,
  Eye,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { OrderDelete } from './order-delete'
import { OrderEditSheet } from './order-edit-sheet'
import { OrderPaymentSheet } from './order-payment-sheet'
import { OrderPrintSheet } from './order-print-sheet'
import { printDocument, downloadPDF } from '@/lib/print-utils'

interface OrderActionsProps {
  order: Tables<'orders'>
}

export function OrderActions({ order }: OrderActionsProps) {
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showPaymentSheet, setShowPaymentSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewSheet, setShowViewSheet] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Handler para ver la orden (abre modal con vista previa)
  const handleViewOrder = () => {
    setShowViewSheet(true)
  }

  // Handler para imprimir directamente
  const handleDirectPrint = () => {
    // Crear un elemento temporal con el contenido de la orden
    const tempDiv = document.createElement('div')
    tempDiv.id = 'temp-order-print'
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '-9999px'

    // Importar dinámicamente el componente OrderPrint
    import('./order-print').then(({ OrderPrint }) => {
      const React = require('react')
      const ReactDOM = require('react-dom/client')

      document.body.appendChild(tempDiv)
      const root = ReactDOM.createRoot(tempDiv)

      root.render(React.createElement(OrderPrint, { order }))

      // Esperar un momento para que se renderice
      setTimeout(() => {
        printDocument('temp-order-print')
        // Limpiar después de imprimir
        setTimeout(() => {
          document.body.removeChild(tempDiv)
        }, 1000)
      }, 100)
    })
  }

  // Handler para descargar PDF directamente
  const handleDownloadPDF = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    try {
      // Crear un elemento temporal con el contenido de la orden
      const tempDiv = document.createElement('div')
      tempDiv.id = 'temp-order-pdf'
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'

      // Importar dinámicamente el componente OrderPrint
      const { OrderPrint } = await import('./order-print')
      const React = require('react')
      const ReactDOM = require('react-dom/client')

      document.body.appendChild(tempDiv)
      const root = ReactDOM.createRoot(tempDiv)

      root.render(React.createElement(OrderPrint, { order }))

      // Esperar un momento para que se renderice
      setTimeout(async () => {
        try {
          await downloadPDF('temp-order-pdf', {
            filename: `orden-${order.order_number || order.id}.pdf`,
            format: 'a4',
            orientation: 'portrait',
          })
        } catch (error) {
          console.error('Error al descargar PDF:', error)
        } finally {
          // Limpiar después de descargar
          document.body.removeChild(tempDiv)
          setIsDownloading(false)
        }
      }, 100)
    } catch (error) {
      console.error('Error al preparar descarga PDF:', error)
      setIsDownloading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPaymentSheet(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Pagar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewOrder}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Orden
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDirectPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Descargando...' : 'Descargar PDF'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderEditSheet
        order={order}
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
      />

      <OrderPaymentSheet
        order={order}
        open={showPaymentSheet}
        onOpenChange={setShowPaymentSheet}
      />

      <OrderDelete
        order={order}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
      <OrderPrintSheet
        order={order}
        open={showViewSheet}
        onOpenChange={setShowViewSheet}
      />
    </>
  )
}

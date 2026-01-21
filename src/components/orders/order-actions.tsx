'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CreditCard,
  Printer,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Tables } from '@/types/supabase.types'
import { OrderDelete } from './order-delete'
import { OrderEdit } from './order-edit'
import { OrderPaymentSheet } from './order-payment-sheet'

import { downloadPDF, previewDocument } from '@/lib/print-utils'
interface OrderActionsProps {
  order: Tables<'orders'>
}

export function OrderActions({ order }: OrderActionsProps) {
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showPaymentSheet, setShowPaymentSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [isDownloading, setIsDownloading] = useState(false)

  // Handler para imprimir directamente
  const handleDirectPrint = () => {
    // Abrir la página de impresión y usar la función de impresión del navegador
    const printURL = `/orders/${order.id}/print`
    const printWindow = window.open(printURL, '_blank')

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  // Handler para descargar PDF directamente
  const handleDirectDownloadPDF = async () => {
    if (isDownloading) return

    setIsDownloading(true)
    try {
      await downloadPDF(order.id, {
        filename: `orden-${order.order_number || order.id}.pdf`,
      })
    } catch (error) {
      console.error('Error al descargar PDF:', error)
    } finally {
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
          <DropdownMenuItem onClick={() => previewDocument(order.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDirectPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDirectDownloadPDF}
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

      <OrderEdit
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
    </>
  )
}

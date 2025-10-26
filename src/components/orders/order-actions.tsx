'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, CreditCard, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { OrderDelete } from './order-delete'
import { OrderEditSheet } from './order-edit-sheet'
import { OrderPaymentSheet } from './order-payment-sheet'
import { OrderPrintSheet } from './order-print-sheet'

interface OrderActionsProps {
  order: Tables<'orders'>
}

export function OrderActions({ order }: OrderActionsProps) {
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showPaymentSheet, setShowPaymentSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPrintSheet, setShowPrintSheet] = useState(false)

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
          <DropdownMenuItem onClick={() => setShowPrintSheet(true)}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </DropdownMenuItem>
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
    </>
  )
}

'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PaymentMethodEdit } from './payment-method-edit'
import { PaymentMethodDelete } from './payment-method-delete'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

type PaymentMethod = Tables<'payment_methods'>

interface PaymentMethodActionsProps {
  paymentMethod: PaymentMethod
}

export function PaymentMethodActions({
  paymentMethod,
}: PaymentMethodActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

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
          <CanAccess resource="payment_methods" action="update">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess resource="payment_methods" action="delete">
            <DropdownMenuItem
              onClick={() => setDeleteOpen(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentMethodEdit
        paymentMethod={paymentMethod}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <PaymentMethodDelete
        paymentMethod={paymentMethod}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

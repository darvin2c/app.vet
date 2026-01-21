'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CustomerEdit } from './customer-edit'
import { CustomerDelete } from './customer-delete'
import { Tables } from '@/types/supabase.types'
import CanAccess from '@/components/ui/can-access'

type Customer = Tables<'customers'>

interface CustomerActionsProps {
  customer: Customer
  onView?: (customer: Customer) => void
}

export function CustomerActions({ customer, onView }: CustomerActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleCall = () => {
    if (customer.phone) {
      window.open(`tel:${customer.phone}`, '_self')
    }
  }

  const handleEmail = () => {
    if (customer.email) {
      window.open(`mailto:${customer.email}`, '_self')
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
          {onView && (
            <CanAccess resource="customers" action="read">
              <DropdownMenuItem onClick={() => onView(customer)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </CanAccess>
          )}

          <CanAccess resource="customers" action="update">
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>

          {customer.phone && (
            <CanAccess resource="customers" action="read">
              <DropdownMenuItem onClick={handleCall}>
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </DropdownMenuItem>
            </CanAccess>
          )}

          {customer.email && (
            <CanAccess resource="customers" action="read">
              <DropdownMenuItem onClick={handleEmail}>
                <Mail className="mr-2 h-4 w-4" />
                Enviar email
              </DropdownMenuItem>
            </CanAccess>
          )}

          <DropdownMenuSeparator />

          <CanAccess resource="customers" action="delete">
            <DropdownMenuItem
              onClick={() => setShowDelete(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <CustomerEdit
        customerId={customer.id}
        open={showEdit}
        onOpenChange={setShowEdit}
      />

      <CustomerDelete
        customer={customer}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  )
}

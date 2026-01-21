'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, IdCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/supabase.types'
import { SupplierEdit } from './supplier-edit'
import { SupplierDelete } from './supplier-delete'
import Link from 'next/link'
import CanAccess from '@/components/ui/can-access'

type Supplier = Tables<'suppliers'>

interface SupplierActionsProps {
  supplier: Supplier
}

export function SupplierActions({ supplier }: SupplierActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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
          <CanAccess resource="suppliers" action="read">
            <DropdownMenuItem asChild>
              <Link
                href={`/suppliers/${supplier.id}`}
                className="flex items-center"
              >
                <IdCard className="mr-2 h-4 w-4" />
                Ver perfil
              </Link>
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess resource="suppliers" action="update">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <CanAccess resource="suppliers" action="delete">
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <SupplierEdit
        supplier={supplier}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <SupplierDelete
        supplier={supplier}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}

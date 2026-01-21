'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { Tables } from '@/types/supabase.types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductBrandEdit } from './product-brand-edit'
import { ProductBrandDelete } from './product-brand-delete'
import CanAccess from '@/components/ui/can-access'

interface ProductBrandActionsProps {
  brand: Tables<'product_brands'>
}

export function ProductBrandActions({ brand }: ProductBrandActionsProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

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
          <CanAccess resource="product_brands" action="update">
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </CanAccess>
          <DropdownMenuSeparator />
          <CanAccess resource="product_brands" action="delete">
            <DropdownMenuItem
              onClick={() => setShowDelete(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </CanAccess>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductBrandEdit
        brand={brand}
        open={showEdit}
        onOpenChange={setShowEdit}
      />

      <ProductBrandDelete
        brand={brand}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  )
}

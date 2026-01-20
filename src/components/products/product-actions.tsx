'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Trash2, PackagePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Database } from '@/types/supabase.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductActionsProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onAddStock: (product: Product) => void
}

export function ProductActions({
  product,
  onEdit,
  onDelete,
  onAddStock,
}: ProductActionsProps) {
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
          <DropdownMenuItem onClick={() => onAddStock(product)}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Agregar Stock
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(product)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(product)}
            className="text-destructive"
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

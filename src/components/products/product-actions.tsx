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
import { ProductEdit } from './product-edit'
import { ProductDelete } from './product-delete'
import { ProductMovementCreate } from '@/components/product-movements/product-movement-create'

type Product = Database['public']['Tables']['products']['Row']

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showStockDialog, setShowStockDialog] = useState(false)

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
          <DropdownMenuItem onClick={() => setShowStockDialog(true)}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Agregar Stock
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
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

      <ProductMovementCreate
        open={showStockDialog}
        onOpenChange={setShowStockDialog}
        productId={product.id}
      />

      <ProductEdit
        product={product}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <ProductDelete
        product={product}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  )
}

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
import { ProductCategoryEdit } from './product-category-edit'
import { ProductCategoryDelete } from './product-category-delete'
import { Database } from '@/types/supabase.types'

type ProductCategory = Database['public']['Tables']['product_categories']['Row']

interface ProductCategoryActionsProps {
  category: ProductCategory
}

export function ProductCategoryActions({
  category,
}: ProductCategoryActionsProps) {
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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductCategoryEdit
        category={category}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ProductCategoryDelete
        category={category}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  )
}

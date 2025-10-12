'use client'

import { useState } from 'react'
import { MoreHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SupplierBrandDelete } from './supplier-brand-delete'

interface SupplierBrandActionsProps {
  supplierId: string
  brandId: string
  supplierName?: string
  brandName?: string
}

export function SupplierBrandActions({
  supplierId,
  brandId,
  supplierName,
  brandName,
}: SupplierBrandActionsProps) {
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
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Desasignar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SupplierBrandDelete
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        supplierId={supplierId}
        brandId={brandId}
        supplierName={supplierName}
        brandName={brandName}
      />
    </>
  )
}
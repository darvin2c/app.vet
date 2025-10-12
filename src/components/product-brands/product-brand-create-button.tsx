'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductBrandCreate } from './product-brand-create'

interface ProductBrandCreateButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function ProductBrandCreateButton({ 
  variant = 'default', 
  size = 'default' 
}: ProductBrandCreateButtonProps) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowCreate(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Nueva Marca
      </Button>

      <ProductBrandCreate
        open={showCreate}
        onOpenChange={setShowCreate}
      />
    </>
  )
}
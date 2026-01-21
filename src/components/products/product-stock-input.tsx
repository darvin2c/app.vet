'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Tables } from '@/types/supabase.types'
import { ProductMovementCreate } from '@/components/product-movements/product-movement-create'

interface ProductStockInputProps {
  mode: 'create' | 'edit'
  value?: number
  onChange?: (value: number | undefined) => void
  product?: Tables<'products'>
  disabled?: boolean
  placeholder?: string
}

export function ProductStockInput({
  mode,
  value,
  onChange,
  product,
  disabled = false,
  placeholder = '0',
}: ProductStockInputProps) {
  const [showMovementModal, setShowMovementModal] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange?.(inputValue === '' ? undefined : Number(inputValue))
  }

  const handleOpenMovementModal = () => {
    setShowMovementModal(true)
  }

  if (mode === 'create') {
    return (
      <Input
        type="number"
        placeholder={placeholder}
        value={value || ''}
        onChange={handleInputChange}
        disabled={disabled}
      />
    )
  }

  // Modo edit
  return (
    <>
      <InputGroup>
        <InputGroupInput
          className="bg-muted"
          disabled
          value={product?.stock || 0}
        />
        <InputGroupButton
          type="button"
          onClick={handleOpenMovementModal}
          variant="ghost"
          aria-label="Gestionar movimientos de stock"
          className="h-9"
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
          Agregar
        </InputGroupButton>
      </InputGroup>

      <ProductMovementCreate
        open={showMovementModal}
        onOpenChange={setShowMovementModal}
        productId={product?.id}
      />
    </>
  )
}

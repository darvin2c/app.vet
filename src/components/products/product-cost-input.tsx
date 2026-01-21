'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Tables } from '@/types/supabase.types'
import { ProductMovementCreate } from '@/components/product-movements/product-movement-create'

interface ProductCostInputProps {
  mode: 'create' | 'edit'
  value?: number
  onChange?: (value: number | undefined) => void
  product?: Tables<'products'>
  disabled?: boolean
  placeholder?: string
}

export function ProductCostInput({
  mode,
  value,
  onChange,
  product,
  disabled = false,
  placeholder = '0.00',
}: ProductCostInputProps) {
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
        step="0.01"
        min="0"
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
          type="number"
          step="0.01"
          value={product?.cost || 0}
          className="bg-muted"
          disabled
        />
        <InputGroupButton
          type="button"
          onClick={handleOpenMovementModal}
          variant="ghost"
          aria-label="Ajustar costo mediante movimiento"
          className="h-9"
          disabled={disabled}
        >
          <Pencil className="h-4 w-4" />
          Cambiar
        </InputGroupButton>
      </InputGroup>

      <ProductMovementCreate
        open={showMovementModal}
        onOpenChange={setShowMovementModal}
        productId={product?.id}
        product={product}
      />
    </>
  )
}
